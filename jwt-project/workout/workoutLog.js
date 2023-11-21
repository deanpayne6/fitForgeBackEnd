require("dotenv").config();
const db = require("../db_connect");

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

//http://localhost:3200/workout/workoutLog
async function workoutLog(username, dateRequested) {
  user_id = 0
  tempLog = []
  sortedLog = []
  queryData = []
  
  const userQuery = "SELECT * FROM users WHERE username = ?"
  const workoutQuery = "SELECT workoutplan_exercises.day, sets, reps, rest, weight, rpe, exercises.name, musclegroup FROM workoutplan_exercises INNER JOIN exercises ON workoutplan_exercises.exercise_id = exercises.exercise_id WHERE (workoutplan_exercises.user_id = ?) and (workoutplan_exercises.day = ?)"
  
  let userData = await db.query(userQuery, username)
  if(userData.length > 0)
    user_id = userData[0].user_id
  else
    return ["Invalid Username", sortedLog] 

  for(let j = 0; j < dateRequested.length; j++){
    holdWorkoutData = await db.query(workoutQuery, [user_id, dateRequested[j]])
    for(let i = 0; i < holdWorkoutData.length; i++){
      tempData = setWorkoutInfo(holdWorkoutData[i])
      tempLog.push(tempData)
    }
    sortedLog.push(tempLog)
    tempLog = []
  }
  return ["Success", sortedLog]
}

//http://localhost:3200/submitWorkout
async function submitWorkout(workoutList, rpe, username){
  workoutInfo = []
  exercise_id = 0
  user_id = 0
  count = 0
  date = new Date()

  const userQuery = "SELECT * FROM users where username = ?"
  const workoutQuery = "SELECT * FROM exercises where name = ?"
  const insertQuery = "INSERT INTO workoutplan_exercises (user_id, day, exercise_id, sets, reps, rest, rpe) VALUES (?, ?, ?, ?, ?, ?, ?)"

  let userData = await db.query(userQuery, username)
  if(userData.length > 0){
    user_id = userData[0].user_id
  }
  else
    return "Invalid Username"

  for(let i = 0; i < workoutList.length; i++){
    let workoutData = await db.query(workoutQuery, workoutList[i].workoutName)
    exercise_id = workoutData[0].exercise_id
    workoutInfo = [user_id, date, exercise_id, workoutList[i].workoutSets, workoutList[i].workoutReps, workoutList[i].workoutRest, rpe[i]]
    await db.query(insertQuery, workoutInfo)
  }
  return "Success"
}

module.exports = {workoutLog, submitWorkout};