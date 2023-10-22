require("dotenv").config();
const mysql = require("mysql")
const generateWorkout = require("./generateWorkout")

//http://localhost:3200/updateWorkout
function updateWorkout(req, res){
    revisedWorkout = []
    activitylevel_id = 0
    var con = mysql.createConnection({
        host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
        user: "fitforge",
        password: "fitforge",
        database: "fitforge"
    });

    const {workoutList, newWorkout, index, username} = req.body
    const query1 = "SELECT * FROM users where username = ?"
    const query2 = "SELECT * FROM exercises where name = ?"
    con.connect(function(err){
        if (err) throw err;
        con.query(query1, username, function (err, result){
            if (err) throw err;
            if(result.length > 0){
                activitylevel_id = result[0].activitylevel_id
            con.query(query2, newWorkout, function (err, result){
                if (err) throw err;
                if(result.length > 0){
                    holdWorkout = result[0]
                    for(let i = 0; i < workoutList.length; i++){
                        if(i == index){
                            setInfo = generateWorkout.getSetInfo(holdWorkout.settype, activitylevel_id, holdWorkout.musclegroup)
                            tempWorkout = [holdWorkout.musclegroup, holdWorkout.name, setInfo[0], 
                            setInfo[1], setInfo[2], holdWorkout.targetmuscles, holdWorkout.videourl]
                            revisedWorkout.push(tempWorkout)
                        }
                        else
                            revisedWorkout.push(workoutList[i])
                    }
                    res.status(200).json(revisedWorkout)
                }
                else
                    res.status(400).send("Invalid Workout")
                })
            }
            else
                res.status(400).send("Invalid Username")
        })
    })
}

//http://localhost:3200/sendMuscleSwap
function sendMuscleSwap(req, res){
    char = ","
    substring = ""
    equipmentlevel_id = 0
    muscleList = []
    target = ""
    var con = mysql.createConnection({
        host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
        user: "fitforge",
        password: "fitforge",
        database: "fitforge"
    });

    const {workoutName, username} = req.body
    const query1 = "SELECT * FROM users where username = ?"
    const query2 = "SELECT * FROM exercises where name = ?"
    const query3 = "SELECT * FROM exercises WHERE (musclegroup = ?) and (equipmentlevel_id = ?)"
    con.connect(function(err){
        if (err) throw err;
        con.query(query1, username, function (err, result){
            if (err) throw err;
            if(result.length > 0){
                equipmentlevel_id = result[0].equipmentlevel_id
                con.query(query2, workoutName, function(err, result){
                    if (err) throw err;
                    if(result.length > 0){
                        workoutInfo = result[0]
                        index = workoutInfo.targetmuscles.indexOf(char)
                        if(index > 0){
                            substring = workoutInfo.targetmuscles.substr(0, index-1)
                            target = substring
                        }
                        else{
                            target = workoutInfo.targetmuscles
                        }
                        queryData = [workoutInfo.musclegroup, equipmentlevel_id]
                        con.query(query3, queryData, function(err, result){
                            if (err) throw err;
                            for(let i = 0; i < result.length; i++){
                                if(result[i].name != workoutName){
                                    check = result[i].targetmuscles.includes(target)
                                    if(check == true){
                                        muscleList.push(result[i].name)
                                    }
                                }
                            }
                            res.status(200).json(muscleList)
                        })
                    }
                    else   
                        res.status(400).send("Invalid Workout Name")
                })
            }
            else
                res.status(400).send("Invalid Username")
        })
    })
}

module.exports = {updateWorkout, sendMuscleSwap};