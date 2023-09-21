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

app.post("/generateWorkout", async (req,res) => {
    //Arrays of workouts for testing generate workout
    //Once Database is set up, the sql queries will go here, will grab the list from each muscle group and put them into a list like shown below
    testBicep = ["Dumbbell Curl", "Reverse Dumbbell Curl", "Dumbbell Hammer Curl", "Zottman Bicep Curl", "Concentration Bicep Curl", 
    "Dumbbell Incline Biceps Curl", "Dumbbell Wall BicepsCurl", "Step Back BicepsCurl", "Dumbbell Pinwheel BicepsCurl", 
    "Offset BicepsCurl", "Biceps 21s"]
    testTricep = ["Neutral Grip Dumbbell Bench Press", "JM Dumbbell Bench Press", "Dumbbell Skull Crushers", "Dumbbell Tate Presses", 
    "Overhead Dumbbell Extensions", "Dumbbell Kickbacks", "Dumbbell-Loaded Triceps Dips"]
    testChest = ["Becnh Press", "incline Bench Press", "Decline Bench Press", "Chest Fly", "Dumbbell Reverse Chest Press"]
    testBack = ["Dumbbell Row", "Incline Row", "Elevated Plank Row", "Dumbbell Pullover", "Incline Pause Row", "Bent Over Row",
    "Upright Row", "Farmers Carry"]
    testShoulder = ["Dumbbell shoulder press", "Dumbbell front raise", "Dumbbell side lateral raise", "Dumbbell bent-over raise", 
        "Dumbbell upright row", "Dumbbell shoulder shrugs", "One arm dumbbell swing", "Spellcaster", "Seesaw Press"]
    testAbs = ["Sit-Ups", "Crunch", "Heel Taps", "Plank Hold", "Leg Raises", "Bicycle Crunch", "Pike Crunch", "Reverse Crunch", "Hollow Holds"]
    testLegs = ["Dumbbell Split Squat", "Dumbbell Romanian Deadlift", "Dumbbell Single Leg RDL", "Dumbbell Goblet Squat", 
    "Dumbbell Side Lunge", "Dumbbell Reverse Lunge", "Dumbbell Front Squat", "Dumbbell Elevated Split Squat", 
    "Dumbbell Forward Lunge", "Weighted Step Up", "Dumbbell Jump Squat"]

    //allWorkouts and muscleGroup array will stay, the rest will not be needed once front end is done
    allWorkouts = [testBicep, testTricep, testChest, testBack, testShoulder, testAbs, testLegs]
    muscleGroup = [" Bicep", " Tricep", " Chest", " Back", " Shoulder", " Abs", " Legs"]
    lengthList = ["Short", "Medium", "Long"]
    console.log('\n1. Bicep\n2. Tricep\n3. Chest\n4. Back\n5. Shoulder\n6. Abs\n7. Legs')

    //Actual logic start
    const {workoutInput, workoutLength} = req.body;
    muscleArray = []
    chosenGroups = []
    workoutList = []
    count = 0
    for(let i = 0; i < workoutInput.length; i++){
        temp = workoutInput[i]
        chosenGroups.push(muscleGroup[temp-1])
        muscleArray.push(allWorkouts[temp-1])
    }
    console.log("The muscle groups you chose are:" + chosenGroups)

    //Start of Logic for Generate Workout, everything above will change, everything below should stay the same
    //Short Workout Length, 1 Workout Chosen
    if((workoutLength == 1) && (muscleArray.length == 1)){
        for(let i = 0; i < 3; i++){
            if(count == muscleArray.length)
                count = 0
            singleGroup = muscleArray[count]
            randomWorkout = Math.floor(Math.random() * singleGroup.length)
            workoutList.push(singleGroup[randomWorkout])
            muscleArray[count].splice(randomWorkout, 1)
            count++
        }
    }

    //Short Workout Length, 2-3 Workouts Chosen
    //Medium Workout Length, 1 Workout Chosen
    else if(((workoutLength == 1) && (muscleArray.length >= 2)) || ((workoutLength == 2) && (muscleArray.length == 1))){
        for(let i = 0; i < 4; i++){
            if(count == muscleArray.length)
                count = 0
            singleGroup = muscleArray[count]
            randomWorkout = Math.floor(Math.random() * singleGroup.length)
            workoutList.push(singleGroup[randomWorkout])
            muscleArray[count].splice(randomWorkout, 1)
            count++
        }
    }

    //Medium Workout Length, 2-3 Workouts Chosen
    //Long Workout Length, 1 Workout Chosen
    else if(((workoutLength == 2) && (muscleArray.length >= 2)) || ((workoutLength == 3) && (muscleArray.length == 1))){
        for(let i = 0; i < 6; i++){
            if(count == muscleArray.length)
                count = 0
            singleGroup = muscleArray[count]
            randomWorkout = Math.floor(Math.random() * singleGroup.length)
            workoutList.push(singleGroup[randomWorkout])
            muscleArray[count].splice(randomWorkout, 1)
            count++
        }
    }

    //Long Workout Length, 2-3 Workouts Chosen
    else if((workoutLength == 3) && (muscleArray.length >= 2)){
        for(let i = 0; i < 8; i++){
            if(count == muscleArray.length)
                count = 0
            singleGroup = muscleArray[count]
            randomWorkout = Math.floor(Math.random() * singleGroup.length)
            workoutList.push(singleGroup[randomWorkout])
            muscleArray[count].splice(randomWorkout, 1)
            count++
        }
    }

    if(workoutList.length > 0){
        console.log("Here is your workout for the day: ")
        res.status(200).json(workoutList)
        console.log("Thank You For Using FitForge!")
    }
    else{
        res.status(400).send("Invalid Inputs")
    }
})

//will get username, use that to create a sql query that grabs all workouts from the past
//return an array of the past workouts and their lengths
app.post("/workoutLog", async (req,res) => {
    //db logic
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
        con.query(query, user.username, function (err, result, fields) {
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