require("dotenv").config();
const db = require("../db_connect");

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

//http://localhost:3200/workout/generateWorkout
async function generateWorkout(workoutInput, workoutLength, username){
    muscleArray = []
    workoutList = []
    tempArray = []
    equipmentlevel_id = 0
    activitylevel_id = 0
    count = 0

    const userQuery = "SELECT * FROM users where username = ?"
    const workoutQuery = "SELECT * FROM exercises WHERE equipmentlevel_id = ?"
    let userData = await db.query(userQuery, username)
    if(userData.length > 0){
        equipmentlevel_id = userData[0].equipmentlevel_id
        activitylevel_id = userData[0].activitylevel_id
    }
    else
        return ["Invalid Username", workoutList]

    let workoutData = await db.query(workoutQuery, equipmentlevel_id)
    for(let i = 0; i < workoutInput.length; i++){
        for(let j = 0; j < workoutData.length; j++){
            if(workoutData[j].musclegroup == workoutInput[i]){
                tempArray.push(workoutData[j])
            }
        }
        muscleArray.push(tempArray)
        tempArray = []
    }
    workoutList = getWorkout(getWorkoutLength(workoutLength, workoutInput), muscleArray, workoutInput, activitylevel_id)
    return ["Success", workoutList]
}

//http://localhost:3200/workout/checkWorkout
async function checkWorkout(username){
    user_id = 0
    const date = new Date().toLocaleString('en-US', {
        timeZone: 'America/Vancouver'
    })
    year = date.substring(5,9)
    month = date.substring(0,2)
    day = date.substring(3,4)
    const formatDate = new Date(year,month-1,day)
    
    const userQuery = "SELECT * FROM users where username = ?"
    const workoutQuery = "SELECT * FROM workoutplan WHERE user_id = ? and day = ?"
    let userData = await db.query(userQuery, username)
    if(userData.length > 0)
        user_id = userData[0].user_id
    else
        return "Invalid Username"

    let workoutData = await db.query(workoutQuery, [user_id, formatDate])
    if(workoutData.length > 0)
        return true
    else
        return false
}

module.exports = {generateWorkout, getSetInfo, checkWorkout};