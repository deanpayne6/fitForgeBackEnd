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

//http://localhost:3200/workoutLog
async function workoutLog(username, dateRequested) {
  user_id = 0
  tempLog = []
  sortedLog = []
  workoutData = []
  
  const userQuery = "SELECT * FROM users WHERE username = ?"
  const workoutQuery = "SELECT workoutplan_exercises.day, sets, reps, rest, weight, rpe, exercises.name, musclegroup FROM workoutplan_exercises INNER JOIN exercises ON workoutplan_exercises.exercise_id = exercises.exercise_id WHERE (workoutplan_exercises.user_id = ?) and (workoutplan_exercises.day = ?)"
  
  let userData = await db.query(userQuery, username)
  if(userData.length > 0){
    user_id = userData[0].user_id
    queryData1 = [user_id, dateRequested[0]]
    queryData2 = [user_id, dateRequested[1]]
    queryData3 = [user_id, dateRequested[2]]
  }
  else
    return ["Invalid Username", sortedLog] 

  workoutData.push(await db.query(workoutQuery, queryData1))
  workoutData.push(await db.query(workoutQuery, queryData2))
  workoutData.push(await db.query(workoutQuery, queryData3))
  for(let i = 0; i < 3; i++){
    holdWorkoutData = workoutData[i]
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
  date = new Date();

  const userQuery = "SELECT * FROM users where username = ?"
  const planQuery = "INSERT INTO workoutplan VALUES (?, ?)"
  const workoutQuery = "SELECT * FROM exercises where name = ?"
  const insertQuery = "INSERT INTO workoutplan_exercises (user_id, day, exercise_id, sets, reps, rest, rpe) VALUES (?, ?, ?, ?, ?, ?, ?)"

  let userData = await db.query(userQuery, username)
  if(userData.length > 0){
    user_id = userData[0].user_id
  }
  else
    return "Invalid Username"

  await db.query(planQuery, [user_id, date])
  for(let i = 0; i < workoutList.length; i++){
    let workoutData = await db.query(workoutQuery, workoutList[i].workoutName)
    exercise_id = workoutData[0].exercise_id
    workoutInfo = [user_id, date, exercise_id, workoutList[i].workoutSets, workoutList[i].workoutReps, workoutList[i].workoutRest, rpe[i]]
    await db.query(insertQuery, workoutInfo)
  }
  return "Success"
}

module.exports = {workoutLog, submitWorkout};