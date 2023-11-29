require("dotenv").config();
const db = require("../db_connect");
const generateWorkout = require("./generateWorkout")

//http://localhost:3200/workout/updateWorkout
async function updateWorkout(workoutList, newWorkout, index, username){
    revisedWorkout = []
    activitylevel_id = 0

    const userQuery = "SELECT * FROM users where username = ?"
    const workoutQuery = "SELECT * FROM exercises where name = ?"
    let userData = await db.query(userQuery, username)
    if(userData.length > 0)
        activitylevel_id = userData[0].activitylevel_id
    else
        return ["Invalid Username", revisedWorkout]

    let workoutData = await db.query(workoutQuery, newWorkout)
    for(let i = 0; i < workoutList.length; i++){
        if(i == index){
            setInfo = generateWorkout.getSetInfo(workoutData[0].settype, activitylevel_id, workoutData[0].musclegroup)
            let tempWorkout = {
                workoutMuscleGroup: workoutData[0].musclegroup,
                workoutName: workoutData[0].name,
                workoutSets: setInfo[0],
                workoutReps: setInfo[1],
                workoutRest: setInfo[2],
                workoutTarget: workoutData[0].targetmuscles,
                workoutLink: workoutData[0].videourl,
            }
            revisedWorkout.push(tempWorkout)
        }
        else
            revisedWorkout.push(workoutList[i])
    }
    return ["Success", revisedWorkout]
}

//http://localhost:3200/workout/sendMuscleSwap
async function sendMuscleSwap(workoutList, workoutName, username){
    char = ","
    substring = ""
    equipmentlevel_id = 0
    muscleList = []
    target = ""
    counter = 0

    const userQuery = "SELECT * FROM users where username = ?"
    const workoutQuery = "SELECT * FROM exercises where name = ?"
    const muscleQuery = "SELECT * FROM exercises WHERE (musclegroup = ?) and (equipmentlevel_id = ?)"

    let userData = await db.query(userQuery, username)
    if(userData.length > 0)
        equipmentlevel_id = userData[0].equipmentlevel_id
    else
        return ["Invalid Username", muscleList]

    let workoutData = await db.query(workoutQuery, workoutName)
    workoutInfo = workoutData[0]
    index = workoutInfo.targetmuscles.indexOf(char)
    if(index > 0){
        substring = workoutInfo.targetmuscles.substr(0, index)
        target = substring
    }
    else{
        target = workoutInfo.targetmuscles
    }
    queryData = [workoutInfo.musclegroup, equipmentlevel_id]

    let muscleData = await db.query(muscleQuery, queryData)
    for(let i = 0; i < muscleData.length; i++){
        if(muscleData[i].name != workoutName){
            check = muscleData[i].targetmuscles.includes(target)
            if(check == true){
                for(let k = 0; k < workoutList.length; k++){
                    if(workoutList[k].workoutName != muscleData[i].name)
                        counter++
                }
                if(counter == workoutList.length)
                    muscleList.push(muscleData[i].name)
            }
            counter = 0
        }
    }
    return ["Success", muscleList]
}

module.exports = {updateWorkout, sendMuscleSwap};