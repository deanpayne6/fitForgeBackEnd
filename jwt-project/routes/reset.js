const express = require('express');
const bcrypt = require("bcrypt");
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const  verifyToken  = require("../middleware/auth");
const router = express.Router();
const secretKey = require('../config/secretKey');
const nodemailer = require('nodemailer'); 

//passwordRecovery

//sendEmail

//ChangePassword

async function checkUser(email) {
    const result = await db.query("SELECT user_id FROM users WHERE emailaddress = ?", email);
    if (result.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  
  async function checkPass(email, password) {
    
    // retrieve password hash for comparison
    const result = await db.query("SELECT password_hash FROM users WHERE emailaddress = ?", email);
    const hashed_pass = result[0].password_hash;
  
    // compare the passwords
    const hi = await bcrypt.compare(password, hashed_pass);
    return hi;
    
  }
  
  async function checkData(data, data_name) {
    let query = "SELECT " + data_name + " FROM users WHERE " + data_name + " = '" + data + "'";
    const result = await db.query(query);
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  }

module.exports = router;