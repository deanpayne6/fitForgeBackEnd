const express = require('express');
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const router = express.Router();
const questionnaire_model = require("../models/questionnaire");

router.post("/submission", async (req, res) => {

  // parse incoming data
  const questionnaire = new questionnaire_model(
    req.body.activity, 
    req.body.experience, 
    req.body.gym, 
    req.body.goal, 
    req.body.intensity, 
    req.body.frequency,
    req.body.gender,
    req.body.weight,
    req.body.height,
    req.body.emailaddress
  );
  
  // submit questionnaire data
  const insert_questionnaire = `
      update users 
      set 
        activitylevel_id = (select activitylevel_id from activitylevels where activitylevel = ?),
        experiencelevel_id = (select experiencelevel_id from experiencelevels where experiencelevel = ?),
        equipmentlevel_id = (select equipmentlevel_id from equipmentlevels where equipmentlevel = ?),
        weight = ?,
        height = ?,
        gender = ?,
        role_id = (select role_id from roles where role = ?)
      where 
        emailaddress = ?`;

  const userdata = [
    questionnaire.activity, 
    questionnaire.experience,
    questionnaire.gym,
    questionnaire.weight,
    questionnaire.height,
    questionnaire.gender,
    'User',
    questionnaire.emailaddress
  ];

  const result = await db.query(insert_questionnaire, userdata);

  return res.status(201).json({"status": "201"});

});





module.exports = router;