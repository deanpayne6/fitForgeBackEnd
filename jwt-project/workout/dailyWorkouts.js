require("dotenv").config();
const db = require("../db_connect");

//http://localhost:3200/workout/storeDailyWorkouts
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

//http://localhost:3200/workout/getWorkout
async function getWorkout(date, username){
    user_id = 0
    workoutList = []

    const userQuery = "SELECT * FROM users where username = ?"
    const workoutQuery = "SELECT name, musclegroup, sets, reps, rest, targetmuscles, videourl FROM dailyworkouts_exercises INNER JOIN exercises ON dailyworkouts_exercises.exercise_id = exercises.exercise_id WHERE (dailyworkouts_exercises.user_id = ?) and (dailyworkouts_exercises.day = ?)"
    let userData = await db.query(userQuery, username)
    if(userData.length > 0)
        user_id = userData[0].user_id
    else
        return ["Invalid Username", workoutList]

    let workoutData = await db.query(workoutQuery, [user_id, date])
    for(let i = 0; i < workoutData.length; i++){
        let fullWorkout = {
            workoutMuscleGroup: workoutData[i].musclegroup,
            workoutName: workoutData[i].name,
            workoutSets: workoutData[i].sets,
            workoutReps: workoutData[i].reps,
            workoutRest: workoutData[i].rest,
            workoutTarget: workoutData[i].targetmuscles,
            workoutLink: workoutData[i].videourl,
        }

        workoutList.push(fullWorkout)
    }
    return ["Success", workoutList]
}

//return an array of 8 elements. first will be one of these options, other 7 will be empty or will contain a full workout list
//1 = wokrout already stored
//0 = no workout stored
//-1 = wokrout completed
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

module.exports = {storeDailyWorkouts, getWorkout, checkWorkout}