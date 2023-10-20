require("dotenv").config();
const mysql = require("mysql")
const generateWorkout = require("./generateWorkout")

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

module.exports = {updateWorkout};