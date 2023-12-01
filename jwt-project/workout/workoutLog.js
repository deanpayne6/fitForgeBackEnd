require("dotenv").config();
const db = require("../db_connect");
const dailyWorkouts = require("../workout/dailyWorkouts");

function setWorkoutInfo(workout){
  let workoutInfo = {
    workoutName: workout.name,
    workoutMuscleGroup: workout.musclegroup,
    workoutSets: workout.sets,
    workoutReps: workout.reps,
    workoutRest: workout.rest,
    workoutRpe: workout.rpe
  }
  return workoutInfo
}

//http://localhost:3200/workout/workoutLog
async function workoutLog(username, dateRequested) {
  user_id = 0
  workoutData = []
  
  const userQuery = "SELECT * FROM users WHERE username = ?"
  const workoutQuery = "SELECT name, musclegroup, sets, reps, rest, rpe FROM workoutplan_exercises INNER JOIN exercises ON workoutplan_exercises.exercise_id = exercises.exercise_id WHERE (workoutplan_exercises.user_id = ?) and (workoutplan_exercises.day = ?)"
  
  let userData = await db.query(userQuery, username)
  if(userData.length > 0)
    user_id = userData[0].user_id
  else
    return ["Invalid Username", workoutData] 

  holdWorkoutData = await db.query(workoutQuery, [user_id, dateRequested])
  for(let i = 0; i < holdWorkoutData.length; i++){
    tempData = setWorkoutInfo(holdWorkoutData[i])
    workoutData.push(tempData)
  }
  return ["Success", workoutData]
}

//Old workoutLog code
// async function workoutLog(username, dateRequested) {
//   user_id = 0
//   tempLog = []
//   sortedLog = []
//   queryData = []
  
//   const userQuery = "SELECT * FROM users WHERE username = ?"
//   const workoutQuery = "SELECT name, musclegroup, sets, reps, rest, rpe FROM workoutplan_exercises INNER JOIN exercises ON workoutplan_exercises.exercise_id = exercises.exercise_id WHERE (workoutplan_exercises.user_id = ?) and (workoutplan_exercises.day = ?)"
  
//   let userData = await db.query(userQuery, username)
//   if(userData.length > 0)
//     user_id = userData[0].user_id
//   else
//     return ["Invalid Username", sortedLog] 

//   for(let j = 0; j < dateRequested.length; j++){
//     holdWorkoutData = await db.query(workoutQuery, [user_id, dateRequested[j]])
//     for(let i = 0; i < holdWorkoutData.length; i++){
//       tempData = setWorkoutInfo(holdWorkoutData[i])
//       tempLog.push(tempData)
//     }
//     sortedLog.push(tempLog)
//     tempLog = []
//   }
//   return ["Success", sortedLog]
// }

//http://localhost:3200/workout/submitWorkout
async function submitWorkout(ratings, username){
  workoutInfo = []
  exercise_id = 0
  user_id = 0
  count = 0
  const date = new Date() 
  day = date.getDate()
  month = date.getMonth() + 1
  year = date.getFullYear()
  formatDate = year + "-" + month + "-" + day

  const userQuery = "SELECT * FROM users where username = ?"
  const workoutQuery = "SELECT * FROM exercises where name = ?"
  const insertQuery = "INSERT INTO workoutplan_exercises (user_id, day, exercise_id, sets, reps, rest, rpe) VALUES (?, ?, ?, ?, ?, ?, ?)"
  const dropDaily = "DELETE FROM dailyworkouts_exercises WHERE user_id = ? and day = ?"

  let userData = await db.query(userQuery, username)
  if(userData.length > 0){
    user_id = userData[0].user_id
  }
  else
    return "Invalid Username"

  daily = await dailyWorkouts.getWorkout(formatDate, username)
  workoutList = daily[1]
  if(workoutList.length > 0){
    for(let i = 0; i < workoutList.length; i++){
      workoutData = await db.query(workoutQuery, workoutList[i].workoutName)
      exercise_id = workoutData[0].exercise_id
      workoutInfo = [user_id, formatDate, exercise_id, workoutList[i].workoutSets, workoutList[i].workoutReps, workoutList[i].workoutRest, ratings[i]]
      await db.query(insertQuery, workoutInfo)
    }
    await db.query(dropDaily, [user_id, formatDate])
    return "Success"
  }
  else
    return "No Workout Stored"
  
}

module.exports = {workoutLog, submitWorkout};