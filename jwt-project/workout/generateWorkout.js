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
            rest = "60"
        }
        else if(activitylevel_id == 2){
            sets = "3"
            reps = "10 Per " + side
            rest = "60"
        }
        else if(activitylevel_id == 3){
            sets = "3"
            reps = "15 Per " + side
            rest = "90"
        }
        else if(activitylevel_id == 4){
            sets = "4"
            reps = "10 Per " + side
            rest = "60"
        }
        else if(activitylevel_id == 5){
            sets = "4"
            reps = "15 Per " + side
            rest = "90"
        }
    }

    else if (settype == "Double"){
        if(activitylevel_id == 1){
            sets = "2"
            reps = "10"
            rest = "60"
        }
        else if(activitylevel_id == 2){
            sets = "3"
            reps = "10"
            rest = "60"
        }
        else if(activitylevel_id == 3){
            sets = "3"
            reps = "12"
            rest = "90"
        }
        else if(activitylevel_id == 4){
            sets = "4"
            reps = "10"
            rest = "60"
        }
        else if(activitylevel_id == 5){
            sets = "4"
            reps = "12"
            rest = "90"
        }
    }

    else if (settype == "Timed"){
        if(activitylevel_id == 1){
            sets = "2"
            reps = "45 Seconds"
            rest = "60"
        }
        else if(activitylevel_id == 2){
            sets = "3"
            reps = "45 Seconds"
            rest = "60"
        }
        else if(activitylevel_id == 3){
            sets = "3"
            reps = "60 Seconds"
            rest = "90"
        }
        else if(activitylevel_id == 4){
            sets = "4"
            reps = "45 Seconds"
            rest = "60"
        }
        else if(activitylevel_id == 5){
            sets = "4"
            reps = "60 Seconds"
            rest = "90"
        }
    }
    setInfo = [sets, reps, rest]
    return setInfo
}

async function integrateRating(muscleArray, user_id){
    sum = 0
    avg = 0
    roundedAvg = 0
    newMsucleArray = []
    const workoutQuery = "SELECT name, rating FROM workoutplan_exercises INNER JOIN exercises ON workoutplan_exercises.exercise_id = exercises.exercise_id WHERE (workoutplan_exercises.user_id = ?) and (exercises.name = ?)"
    
    for(let n = 0; n < muscleArray.length; n++){
        singleGroup = muscleArray[n]
        updatedGroup = muscleArray[n]
        numberArray = new Array(singleGroup.length)
        for(let i = 0; i < singleGroup.length; i++){
            let workoutData = await db.query(workoutQuery, [user_id, singleGroup[i].name])
            if(workoutData.length > 0){
                for(let k = 0; k < workoutData.length; k++){
                    sum += workoutData[k].rating
                }
                avg = sum/workoutData.length
                roundedAvg = Math.round(avg)
                numberArray[i] = roundedAvg
            }
            else{
                numberArray[i] = 3
            }
            sum = 0
            avg = 0
            roundedAvg = 0
        }
        for(let j = 0; j < singleGroup.length; j++){
            for(let m = 1; m < numberArray[j]; m++){
                updatedGroup.push(singleGroup[j])
            }
        }
        newMsucleArray.push(updatedGroup)
    }
    return newMsucleArray

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
        for(let j = singleGroup.length-1; j >= 0; j--){
            if(singleGroup[j].name == fullWorkout.workoutName){
                muscleArray[count].splice(j, 1)
            }
        }
        count++
    }
    return workoutList
}

function getWorkoutLength(workoutLength, workoutInput){
    if(workoutLength == "Short" && workoutInput.length == 1){
        length = 3
    }
    else if((workoutLength == "Short" && workoutInput.length == 2) || (workoutLength == "Medium" && workoutInput.length == 1)){
        length = 4
    }
    else if((workoutLength == "Medium" && workoutInput.length >= 2) || (workoutLength == "Long" && workoutInput.length == 1)){
        length = 6
    }
    else if((workoutLength == "Long" && workoutInput.length >= 2)){
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
    user_id = 0
    count = 0

    const userQuery = "SELECT * FROM users where username = ?"
    const workoutQuery = "SELECT * FROM exercises WHERE equipmentlevel_id = ?"
    let userData = await db.query(userQuery, username)
    if(userData.length > 0){
        user_id = userData[0].user_id
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
    muscleArray = await integrateRating(muscleArray, user_id)
    workoutList = getWorkout(getWorkoutLength(workoutLength, workoutInput), muscleArray, workoutInput, activitylevel_id)
    return ["Success", workoutList]
}

module.exports = {generateWorkout, getSetInfo};