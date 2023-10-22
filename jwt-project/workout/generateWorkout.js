require("dotenv").config();
const mysql = require("mysql")

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

function getWorkout(length, muscleArray, workoutInput){
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

//http://localhost:3200/generateWorkout
function generateWorkout(req, res){
    const {workoutInput, workoutLength, username} = req.body;
    muscleArray = []
    workoutList = []
    tempArray = []
    equipmentlevel_id = 0
    activitylevel_id = 0
    count = 0
    nullCounter = 0

    var con = mysql.createConnection({
        host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
        user: "fitforge",
        password: "fitforge",
        database: "fitforge"
    });

    const query1 = "SELECT * FROM users where username = ?"
    con.connect(function(err){
        if (err) throw err;
        con.query(query1, username, function (err, result){
            if (err) throw err;
            if (result.length > 0){
                equipmentlevel_id = result[0].equipmentlevel_id
                activitylevel_id = result[0].activitylevel_id

                //Short Workout Length, 1 Workout Chosen
                if((workoutLength == "short") && (workoutInput.length == 1)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(3, muscleArray, workoutInput)

                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }

                //Short Workout Length, 2 Workouts Chosen
                else if((workoutLength == "short") && (workoutInput.length == 2)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ? + ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], workoutInput[1], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(4, muscleArray, workoutInput)

                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }

                //Medium Workout Length, 1 Workout Chosen
                else if((workoutLength == "medium") && (workoutInput.length == 1)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(4, muscleArray, workoutInput)

                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }

                //Medium Workout Length, 2 Workouts Chosen
                else if((workoutLength == "medium") && (workoutInput.length == 2)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ? + ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], workoutInput[1], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(6, muscleArray, workoutInput)
                        
                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }

                //Medium Workout Length, 3 Workouts Chosen
                else if((workoutLength == "medium") && (workoutInput.length == 3)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ? + ? + ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], workoutInput[1], workoutInput[2], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(6, muscleArray, workoutInput)
                        
                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }
                
                //Long Workout Length, 1 Workout Chosen
                else if((workoutLength == "long") && (workoutInput.length == 1)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(6, muscleArray, workoutInput)
                        
                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }

                //Long Workout Length, 2 Workouts Chosen
                else if((workoutLength == "long") && (workoutInput.length == 2)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ? + ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], workoutInput[1], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(8, muscleArray, workoutInput)
                        
                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }

                //Long Workout Length, 3 Workouts Chosen
                else if((workoutLength == "long") && (workoutInput.length == 3)){
                    const query2 = "SELECT * FROM exercises WHERE (musclegroup = ? + ? + ?) and (equipmentlevel_id = ?)"
                    const muscleGroup = [workoutInput[0], workoutInput[1], workoutInput[2], equipmentlevel_id]
                    con.query(query2, muscleGroup, function (err, result){
                        if (err) throw err;
                        for(let i = 0; i < workoutInput.length; i++){
                            for(let j = 0; j < result.length; j++){
                                if(result[j].musclegroup == workoutInput[i]){
                                    tempArray.push(result[j])
                                }
                            }
                            muscleArray.push(tempArray)
                            tempArray = []
                        }
                        workoutList = getWorkout(8, muscleArray, workoutInput)
                        
                        for(let k = 0; k < workoutList.length; k++){
                            if(workoutList[k] == null)
                                nullCounter++
                        }
                        if(nullCounter > 0)
                            res.status(400).send("Invalid Muscle Group(s)")
                        else
                            res.status(200).json(workoutList)
                    })
                }
                else
                    res.status(400).send("Invalid Input(s)")
            }
            else
                res.status(400).send("Invalid Username")
        })
    })
}

module.exports = {generateWorkout, getSetInfo};