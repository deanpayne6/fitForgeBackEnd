const express = require('express');
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const router = express.Router();
const questionnaire_model = require("../models/questionnaire");
const user = require("../models/user");
const mysql = require("mysql");
const updateWorkout = require("../workout/updateWorkout")
const generateWorkout = require("../workout/generateWorkout");
const workoutLog = require("../workout/workoutLog");

//http://localhost:3200/workout/generateWorkout
router.post("/generateWorkout", async (req, res) => {
  const {workoutInput, workoutLength, username} = req.body;
  let data = await generateWorkout.generateWorkout(workoutInput, workoutLength, username);
  
  if(data[0] == "Invalid Username")
    res.status(400).send(data[0])
  
  else if(data[0] == "Success")
    res.status(200).json(data[1])
})

//http://localhost:3200/workout/workoutLog
router.post("/workoutLog", async (req, res) => {
  const {username, dateRequested} = req.body;
  let data = await workoutLog.workoutLog(username, dateRequested);

  if(data[0] == "Invalid Username")
    res.status(400).send(data[0])
  
  else if(data[0] == "Success")
    res.status(200).json(data[1])
})

//http://localhost:3200/workout/submitWorkout
router.post("/submitWorkout", async (req, res) => {
  const {workoutList, rpe, username} = req.body;
  let data = await workoutLog.submitWorkout(workoutList, rpe, username)

  if(data == "Invalid Username")
    res.status(400).send(data)
  
  else if(data == "Success")
    res.status(200).send(data)
})

//http://localhost:3200/workout/updateWorkout
router.post("/updateWorkout", async (req, res) => {
  const {workoutList, newWorkout, index, username} = req.body;
  let data = await updateWorkout.updateWorkout(workoutList, newWorkout, index, username)

  if(data[0] == "Invalid Username")
    res.status(400).send(data[0])
  
  else if(data[0] == "Success")
    res.status(200).json(data[1])
})

//http://localhost:3200/workout/sendMuscleSwap
router.post("/sendMuscleSwap", async (req, res) => {
  const {workoutName, username} = req.body;
  let data = await updateWorkout.sendMuscleSwap(workoutName, username)

  if(data[0] == "Invalid Username")
    res.status(400).send(data[0])
  
  else if(data[0] == "Success")
    res.status(200).json(data[1])
})

module.exports = router;