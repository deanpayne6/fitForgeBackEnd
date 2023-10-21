const express = require('express');
const bcrypt = require("bcrypt");
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get('/recoverpassword', (req, res) => {
    res.send("Reset worked Lets go!");
  });
  
module.exports = router;