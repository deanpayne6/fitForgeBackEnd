require("dotenv").config();
const mysql = require("mysql")

//will get username, use that to create a sql query that grabs all workouts from the past
//return an array of the past workouts and their lengths
//http://localhost:3200/workoutLog
function workoutLog(req,res) {
  var con = mysql.createConnection({
    host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
    user: "fitforge",
    password: "fitforge",
    database: "fitforge"
  });
  const user = req.body;
  const query = "SELECT * FROM fitforge.users WHERE username = ?"
  con.connect(function(err){
    if (err) throw err
    con.query(query, user.username, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        //username exists, create a 2nd and poissbly a 3rd query here to grab the data from previous workouts
        //const query = ""
        //temporary data
        res.status(200).json(data)
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
        for(let i = 0; i < fullWorkout.length; i++){
          con.query(query3, fullWorkout[i][1], function (err, result){
            if (err) throw err;
            exercise_id = result[0].exercise_id
            workoutInfo = [user_id, date, exercise_id, fullWorkout[i][2], fullWorkout[i][3], fullWorkout[i][4], rpe[i]]
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