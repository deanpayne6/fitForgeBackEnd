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
                pastWorkouts = [
                  ["Dumbbell Side Lunge", "Sit-Ups", "Dumbbell Split Squat", "Crunch"],
                  ["Zottman Bicep Curl", "JM Dumbbell Bench Press", "Heel Taps", "Reverse Dumbbell Curl", "Overhead Dumbbell Extensions",
                  "Plank Hold", "Dumbbell Wall BicepsCurl", "Dumbbell Skull Crushers"],
                  ["Dumbbell Side Lunge", "Sit-Ups", "Dumbbell Split Squat", "Crunch"],
                  ["Zottman Bicep Curl", "JM Dumbbell Bench Press", "Heel Taps", "Reverse Dumbbell Curl", "Overhead Dumbbell Extensions",
                  "Plank Hold", "Dumbbell Wall BicepsCurl", "Dumbbell Skull Crushers"],
                  ["Dumbbell Side Lunge", "Sit-Ups", "Dumbbell Split Squat", "Crunch"],
                  ["Zottman Bicep Curl", "JM Dumbbell Bench Press", "Heel Taps", "Reverse Dumbbell Curl", "Overhead Dumbbell Extensions",
                  "Plank Hold", "Dumbbell Wall BicepsCurl", "Dumbbell Skull Crushers"]
              ]
                pastDates = ["9/1/23", "9/5/23", "9/10/23", "9/14/23", "9/19/23", "9/20/23"]
                data = [pastWorkouts, pastDates]
                res.status(200).json(data)
      
              } else {
                res.status(400).json("Invalid Username"); 
              }
          });
      });
}

module.exports = {workoutLog};