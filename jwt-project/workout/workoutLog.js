require("dotenv").config();
const mysql = require("mysql")

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

//http://localhost:3200/workoutLog
function workoutLog(req,res) {
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
}

//http://localhost:3200/submitWorkout
function submitWorkout(req, res){
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
}

module.exports = {workoutLog, submitWorkout};