const express = require('express');
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const router = express.Router();
const questionnaire_model = require("../models/questionnaire");

router.get('/emailAvailability', async (req, res) => {

  const email = req.query.emailaddress;

  const results = await db.queryUserData('emailaddress', email);

  console.log(results);

  if(results.length === 0){
    res.status(200).json({"exists": "false"})
  }
  else {
    res.status(200).json({"exists": "true"})
  }

});



module.exports = router;