require("dotenv").config();
const express = require("express");
const mysql = require("mysql")
const app = express();
app.use(express.json())

const http = require("http");
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const server = http.createServer(app);


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

//http://localhost:3306/generateWorkout
app.post("/generateWorkout", async (req,res) => {
    const {workoutInput, workoutLength, username} = req.body;
    muscleArray = []
    workoutList = []
    tempArray = []
    equipmentLevel = 0
    count = 0

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
                equipmentLevel = result[0].equipmentlevel_id

                //Short Workout Length, 1 Workout Chosen
                if((workoutLength == "short") && (workoutInput.length == 1)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 3; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }

                //Short Workout Length, 2 Workouts Chosen
                else if((workoutLength == "short") && (workoutInput.length == 2)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? + ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], workoutInput[1], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 4; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }

                //Medium Workout Length, 1 Workout Chosen
                else if((workoutLength == "medium") && (workoutInput.length == 1)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 4; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }

                //Medium Workout Length, 2 Workouts Chosen
                else if((workoutLength == "medium") && (workoutInput.length == 2)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? + ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], workoutInput[1], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 6; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }

                //Medium Workout Length, 3 Workouts Chosen
                else if((workoutLength == "medium") && (workoutInput.length == 3)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? + ? + ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], workoutInput[1], workoutInput[2], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 6; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }
                
                //Long Workout Length, 1 Workout Chosen
                else if((workoutLength == "long") && (workoutInput.length == 1)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 6; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }

                //Long Workout Length, 2 Workouts Chosen
                else if((workoutLength == "long") && (workoutInput.length == 2)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? + ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], workoutInput[1], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 8; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }

                //Long Workout Length, 3 Workouts Chosen
                else if((workoutLength == "long") && (workoutInput.length == 3)){
                    const query2 = "SELECT * FROM fitforge.exercises WHERE muscle_group = ? + ? + ? and equipmentlevel = ?"
                    const muscleGroups = [workoutInput[0], workoutInput[1], workoutInput[2], equipmentLevel]
                    con.query(query2, muscleGroups, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].muscle_group == workoutInput[i]){
                                    tempArray.push(result[j].name)
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        for(let i = 0; i < 8; i++){
                            if(count == workoutInput.length)
                                count = 0
                            singleGroup = muscleArray[count]
                            randomWorkout = Math.floor(Math.random() * singleGroup.length)
                            workoutList.push(singleGroup[randomWorkout])
                            muscleArray[count].splice(randomWorkout, 1)
                            count++
                        }
                        res.status(200).json(workoutList)
                    })
                }
                else
                    res.status(400).send("Invalid Inputs")
            }
            else
                res.status(400).send("Invalid Username")
        })
    })
})

//will get username, use that to create a sql query that grabs all workouts from the past
//return an array of the past workouts and their lengths
//http://localhost:3306/workoutLog
app.post("/workoutLog", async (req,res) => {
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
})