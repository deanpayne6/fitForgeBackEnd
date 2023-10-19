require("dotenv").config();
const mysql = require("mysql")

//will get username, use that to create a sql query that grabs all workouts from the past
//return an array of the past workouts and their lengths
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
  const query2 = "SELECT * FROM workoutplan_exercises WHERE (user_id = ?) and (day = ? or ? or ?)"
    con.connect(function(err){
    if (err) throw err
    con.query(query1, username, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        user_id = result[0].user_id
        queryData = [user_id, dateRequested[0], dateRequested[1], dateRequested[2]]
        con.query(query2, queryData, function (err, result) {
          if (err) throw err;
          for(let i = 0; i < 3; i++){
            for(let k = 0; k < result.length; k++){
              day = result[k].day.getDate()
              month = result[k].day.getMonth() + 1
              year = result[k].day.getFullYear()
              dateString = year + "-" + month + "-" + day
              if(dateString == dateRequested[i]){
                tempData = [result[k].name, result[k].sets, result[k].reps, result[k].rest, result[k].rpe]
                tempLog.push(tempData)
              }
            }
            sortedLog.push(tempLog)
            tempLog = []
          }
          res.status(200).json(sortedLog);
        })
      }
      else
        res.status(400).send("Invalid Username"); 
    });
  });
}

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

  const {fullWorkout, rpe, username} = req.body;
  const query1 = "SELECT * FROM users where username = ?"
  const query2 = "INSERT INTO workoutplan VALUES (?, ?)"
  const query3 = "SELECT * FROM exercises where name = ?"
  const query4 = "INSERT INTO workoutplan_exercises (user_id, day, exercise_id, sets, reps, rest, rpe, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  con.connect(function(err){
    if (err) throw err;
    con.query(query1, username, function (err, result){
      if (err) throw err;
      if (result.length > 0){
        user_id = result[0].user_id
        con.query(query2, [user_id, date], function (err, result){
          if (err) throw err;
        })
        for(let i = 0; i < fullWorkout.length; i++){
          con.query(query3, fullWorkout[i][1], function (err, result){
            if (err) throw err;
            exercise_id = result[0].exercise_id
            workoutInfo = [user_id, date, exercise_id, fullWorkout[i][2], fullWorkout[i][3], fullWorkout[i][4], rpe[i], fullWorkout[i][1]]
            con.query(query4, workoutInfo, function (err, result){
              if (err) throw err;
            })
          })
        }
        res.status(200).send("Workout Submitted Successfully")
      }
      else
        res.status(400).send("Invalid Username")
    })
  })
}

module.exports = {workoutLog, submitWorkout};