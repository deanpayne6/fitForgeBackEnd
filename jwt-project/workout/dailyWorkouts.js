require("dotenv").config();
const db = require("../db_connect");

async function storeDailyWorkouts(multipleWorkoutList, username){
    user_id = 0
    const date = new Date()
    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    const userQuery = "SELECT * FROM users WHERE username = ?"
    const planQuery = "INSERT INTO workoutplan VALUES (?, ?)"
    const workoutQuery = "SELECT * FROM exercises WHERE name = ?"
    const dailyQuery = "INSERT INTO dailyworkouts_exercises (user_id, day, exercise_id, sets, reps, rest) VALUES (?, ?, ?, ?, ?, ?)"
    const checkQuery = "SELECT * FROM dailyworkouts_exercises WHERE user_id = ? and day = ?"
    const dropDaily = "DELETE FROM dailyworkouts_exercises WHERE user_id = ? and day = ?"


    let userData = await db.query(userQuery, username)
    if(userData.length > 0)
        user_id = userData[0].user_id
    else
        return "Invalid Username"

    for(let i = 0; i < multipleWorkoutList.length; i++){
        workoutList = multipleWorkoutList[i]
        if(workoutList.length > 0){
            day += i
            formatDate = year + "-" + month + "-" + day
            let checkData = await db.query(checkQuery, [user_id, formatDate])
            if(checkData.length > 0){
                await db.query(dropDaily, [user_id, formatDate])
            }
            else{
                await db.query(planQuery, [user_id, formatDate])
            }

            for(let k = 0; k < workoutList.length; k++){
                let workoutInfo = await db.query(workoutQuery, workoutList[k].workoutName)
                queryData = [user_id, formatDate, workoutInfo[0].exercise_id, workoutList[k].workoutSets, workoutList[k].workoutReps, workoutList[k].workoutRest]
                await db.query(dailyQuery, queryData)
            }
            day = date.getDate()
        }
    }
    return "Success"
}

//1 = start workout
//0 = no workout
//-1 = completed workout
//http://localhost:3200/workout/checkWorkout
async function checkWorkout(username){
    user_id = 0
    const date = new Date() 
    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()
    formatDate = year + "-" + month + "-" + day
    
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

module.exports = {storeDailyWorkouts, checkWorkout}