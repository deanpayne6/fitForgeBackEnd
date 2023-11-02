const express = require('express');
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const router = express.Router();
const questionnaire_model = require("../models/questionnaire");
const user = require("../models/user");
const mysql = require("mysql");

router.post('/submitWorkout', (req, res) => {
  workoutInfo = []
  exercise_id = 0
  user_id = 0
  count = 0
  date = new Date();
  var con = mysql.createConnection({
    host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
    user: "fitforge",
    password: "fitforge",
    database: "fitforge"
  });

  const {workoutList, rpe, username} = req.body;
  const query1 = "SELECT * FROM users where username = ?"
  const query2 = "INSERT INTO workoutplan VALUES (?, ?)"
  const query3 = "SELECT * FROM exercises where name = ?"
  const query4 = "INSERT INTO workoutplan_exercises (user_id, day, exercise_id, sets, reps, rest, rpe) VALUES (?, ?, ?, ?, ?, ?, ?)"
  con.connect(function(err){
    if (err) throw err;
    con.query(query1, username, function (err, result){
      if (err) throw err;
      if (result.length > 0){
        user_id = result[0].user_id
        con.query(query2, [user_id, date], function (err, result){
          if (err) throw err;
        })
        for(let i = 0; i < workoutList.length; i++){
          con.query(query3, workoutList[i].workoutName, function (err, result){
            if (err) throw err;
            exercise_id = result[0].exercise_id
            workoutInfo = [user_id, date, exercise_id, workoutList[i].workoutSets, workoutList[i].workoutReps, workoutList[i].workoutRest, rpe[i]]
            con.query(query4, workoutInfo, function (err, result){
              if (err) throw err;
            })
          })
        }
        res.status(200)
      }
      else
        res.status(400).send("Invalid Username")
    })
  })
});

router.post('/workoutLog', (req, res) => {
  user_id = 0
  tempLog = []
  sortedLog = []
  var con = mysql.createConnection({
    host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
    user: "fitforge",
    password: "fitforge",
    database: "fitforge"
  });
  const {username, dateRequested} = req.body;
  const query1 = "SELECT * FROM users WHERE username = ?"
  const query2 = "SELECT workoutplan_exercises.day, sets, reps, rest, weight, rpe, exercises.name, musclegroup FROM workoutplan_exercises INNER JOIN exercises ON workoutplan_exercises.exercise_id = exercises.exercise_id WHERE (workoutplan_exercises.user_id = ?) and (workoutplan_exercises.day = ?)"
    con.connect(function(err){
    if (err) throw err
    con.query(query1, username, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        user_id = result[0].user_id
        queryData1 = [user_id, dateRequested[0]]
        queryData2 = [user_id, dateRequested[1]]
        queryData3 = [user_id, dateRequested[2]]
        con.query(query2, queryData1, function (err, result) {
          if (err) throw err;
          for(let i = 0; i < result.length; i++){
            tempData = setWorkoutInfo(result[i])
            tempLog.push(tempData)
          }
          sortedLog.push(tempLog)
          tempLog = []
          con.query(query2, queryData2, function (err, result) {
            if (err) throw err;
            for(let i = 0; i < result.length; i++){
              tempData = setWorkoutInfo(result[i])
              tempLog.push(tempData)
            }
            sortedLog.push(tempLog)
            tempLog = []
            con.query(query2, queryData3, function (err, result) {
              if (err) throw err;
              for(let i = 0; i < result.length; i++){
                tempData = setWorkoutInfo(result[i])
                tempLog.push(tempData)
              }
              sortedLog.push(tempLog)
              res.status(200).json(sortedLog);
            })
          })
        })
      }
      else
        res.status(400).send("Invalid Username"); 
    });
  });
});

router.post('/sendMuscleSwap', (req, res) => {
  char = ","
  substring = ""
  equipmentlevel_id = 0
  muscleList = []
  target = ""
  var con = mysql.createConnection({
      host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
      user: "fitforge",
      password: "fitforge",
      database: "fitforge"
  });

  const {workoutName, username} = req.body
  const query1 = "SELECT * FROM users where username = ?"
  const query2 = "SELECT * FROM exercises where name = ?"
  const query3 = "SELECT * FROM exercises WHERE (musclegroup = ?) and (equipmentlevel_id = ?)"
  con.connect(function(err){
      if (err) throw err;
      con.query(query1, username, function (err, result){
          if (err) throw err;
          if(result.length > 0){
              equipmentlevel_id = result[0].equipmentlevel_id
              con.query(query2, workoutName, function(err, result){
                  if (err) throw err;
                  if(result.length > 0){
                      workoutInfo = result[0]
                      index = workoutInfo.targetmuscles.indexOf(char)
                      if(index > 0){
                          substring = workoutInfo.targetmuscles.substr(0, index-1)
                          target = substring
                      }
                      else{
                          target = workoutInfo.targetmuscles
                      }
                      queryData = [workoutInfo.musclegroup, equipmentlevel_id]
                      con.query(query3, queryData, function(err, result){
                          if (err) throw err;
                          for(let i = 0; i < result.length; i++){
                              if(result[i].name != workoutName){
                                  check = result[i].targetmuscles.includes(target)
                                  if(check == true){
                                      muscleList.push(result[i].name)
                                  }
                              }
                          }
                          res.status(200).json(muscleList)
                      })
                  }
                  else   
                      res.status(400).send("Invalid Workout Name")
              })
          }
          else
              res.status(400).send("Invalid Username")
      })
  })
});

router.post('/updateWorkout', (req, res) => {
  revisedWorkout = []
    activitylevel_id = 0
    var con = mysql.createConnection({
        host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
        user: "fitforge",
        password: "fitforge",
        database: "fitforge"
    });

    const {workoutList, newWorkout, index, username} = req.body
    const query1 = "SELECT * FROM users where username = ?"
    const query2 = "SELECT * FROM exercises where name = ?"
    con.connect(function(err){
        if (err) throw err;
        con.query(query1, username, function (err, result){
            if (err) throw err;
            if(result.length > 0){
                activitylevel_id = result[0].activitylevel_id
            con.query(query2, newWorkout, function (err, result){
                if (err) throw err;
                if(result.length > 0){
                    holdWorkout = result[0]
                    for(let i = 0; i < workoutList.length; i++){
                        if(i == index){
                            setInfo = getSetInfo(holdWorkout.settype, activitylevel_id, holdWorkout.musclegroup)
                            let tempWorkout = {
                                workoutMuscleGroup: holdWorkout.musclegroup,
                                workoutName: holdWorkout.name,
                                workoutSets: setInfo[0],
                                workoutReps: setInfo[1],
                                workoutRest: setInfo[2],
                                workoutTarget: holdWorkout.targetmuscles,
                                workoutLink: holdWorkout.videourl,
                            }
                            revisedWorkout.push(tempWorkout)
                        }
                        else
                            revisedWorkout.push(workoutList[i])
                    }
                    res.status(200).json(revisedWorkout)
                }
                else
                    res.status(400).send("Invalid Workout")
                })
            }
            else
                res.status(400).send("Invalid Username")
        })
    })
});

// post request to generate workout
router.post('/generateWorkout', (req, res) => {
  const {workoutInput, workoutLength, username} = req.body;
  muscleArray = []
  workoutList = []
  tempArray = []
  equipmentlevel_id = 0
  activitylevel_id = 0
  count = 0
  nullCounter = 0

  var con = mysql.createConnection({
      host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
      user: "fitforge",
      password: "fitforge",
      database: "fitforge"
  });

  const query1 = "SELECT * FROM users where username = ?"
  con.connect(function(err){
      if (err) throw err;
      con.query(query1, username, function (err, result){
          if (err) throw err;
          if (result.length > 0){
              equipmentlevel_id = result[0].equipmentlevel_id
              activitylevel_id = result[0].activitylevel_id
              const query2 = "SELECT * FROM exercises WHERE equipmentlevel_id = ?"
              con.query(query2, equipmentlevel_id, function (err, result){
                  if (err) throw err;
                  for(let i = 0; i < workoutInput.length; i++){
                      for(let j = 0; j < result.length; j++){
                          if(result[j].musclegroup == workoutInput[i]){
                              tempArray.push(result[j])
                          }
                      }
                      muscleArray.push(tempArray)
                      tempArray = []
                  }
                  workoutList = getWorkout(getWorkoutLength(workoutLength, workoutInput), muscleArray, workoutInput, activitylevel_id)

                  for(let k = 0; k < workoutList.length; k++){
                      if(workoutList[k] == null)
                          nullCounter++
                  }
                  if(nullCounter > 0)
                      res.status(400).send("Invalid Muscle Group(s)")
                  else
                      res.status(200).json(workoutList)
              })
          }
          else
              res.status(400).send("Invalid Username")
      })
  })
});

// function for getting workout length
function getWorkoutLength(workoutLength, workoutInput){
  if(workoutLength == "short" && workoutInput.length == 1){
      length = 3
  }
  else if((workoutLength == "short" && workoutInput.length == 2) || (workoutLength == "medium" && workoutInput.length == 1)){
      length = 4
  }
  else if((workoutLength == "medium" && workoutInput.length >= 2) || (workoutLength == "long" && workoutInput.length == 1)){
      length = 6
  }
  else if((workoutLength == "long" && workoutInput.length >= 2)){
      length = 8
  }
  return length
}

// function for getting workout
function getWorkout(length, muscleArray, workoutInput, activitylevel_id){
  workoutList = []
  for(let i = 0; i < length; i++){
      if(count == workoutInput.length)
          count = 0
      singleGroup = muscleArray[count]
      randomWorkout = Math.floor(Math.random() * singleGroup.length)
      setInfo = getSetInfo(singleGroup[randomWorkout].settype, activitylevel_id, singleGroup[randomWorkout].musclegroup)
      
      let fullWorkout = {
          workoutMuscleGroup: singleGroup[randomWorkout].musclegroup,
          workoutName: singleGroup[randomWorkout].name,
          workoutSets: setInfo[0],
          workoutReps: setInfo[1],
          workoutRest: setInfo[2],
          workoutTarget: singleGroup[randomWorkout].targetmuscles,
          workoutLink: singleGroup[randomWorkout].videourl,
      }

      workoutList.push(fullWorkout)
      muscleArray[count].splice(randomWorkout, 1)
      count++
  }
  return workoutList
}


// function for getting set information
function getSetInfo(settype, activitylevel_id, musclegroup){
  sets = ""
  reps = ""
  rest = ""
  side = "Side"
  if(musclegroup == "Biceps" || musclegroup == "Triceps" || musclegroup == "Chest" || musclegroup == "Back" || musclegroup == "Shoulders")
      side = "Arm"
  else if(musclegroup == "Legs")
      side = "Leg"

  if (settype == "Single"){
      if(activitylevel_id == 1){
          sets = "2"
          reps = "10 Per " + side
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 2){
          sets = "3"
          reps = "10 Per " + side
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 3){
          sets = "3"
          reps = "15 Per " + side
          rest = "90 Seconds"
      }
      else if(activitylevel_id == 4){
          sets = "4"
          reps = "10 Per " + side
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 5){
          sets = "4"
          reps = "15 Per " + side
          rest = "90 Seconds"
      }
  }

  else if (settype == "Double"){
      if(activitylevel_id == 1){
          sets = "2"
          reps = "10"
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 2){
          sets = "3"
          reps = "10"
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 3){
          sets = "3"
          reps = "12"
          rest = "90 Seconds"
      }
      else if(activitylevel_id == 4){
          sets = "4"
          reps = "10"
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 5){
          sets = "4"
          reps = "12"
          rest = "90 Seconds"
      }
  }

  else if (settype == "Timed"){
      if(activitylevel_id == 1){
          sets = "2"
          reps = "45 Seconds"
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 2){
          sets = "3"
          reps = "45 Seconds"
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 3){
          sets = "3"
          reps = "60 Seconds"
          rest = "90 Seconds"
      }
      else if(activitylevel_id == 4){
          sets = "4"
          reps = "45 Seconds"
          rest = "60 Seconds"
      }
      else if(activitylevel_id == 5){
          sets = "4"
          reps = "60 Seconds"
          rest = "90 Seconds"
      }
  }
  setInfo = [sets, reps, rest]
  return setInfo
}

function setWorkoutInfo(result){
  let workoutInfo = {
    workoutName: result.name,
    workoutMuscleGroup: result.musclegroup,
    workoutSets: result.sets,
    workoutReps: result.reps,
    workoutRest: result.rest,
    workoutRpe: result.rpe
  }
  return workoutInfo
}

module.exports = router;