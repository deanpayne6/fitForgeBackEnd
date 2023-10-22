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

// Email Verification
async function tokenSender(email){
    const transporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: secure_configuration.EMAIL_USERNAME, 
            pass: secure_configuration.PASSWORD 
        } 
    }); 
      
    const token = jwt.sign({ 
            data: 'Token Data'  , 
        }, secretKey, { expiresIn: '10m' }   
    );     
      
    const mailConfigurations = { 
      
        // Send FitForge Support Email
        from: 'fitForge.support@gmail.com', 
      
        to: email, 
      
        // Subject of Email 
        subject: 'Email Verification', 
          
        // The email that is sent to user. 
        text: `Hi! There, You have recently visited  
               our website and entered your email. 
               Please follow the given link to verify your email 
               http://localhost:3200/verify/${token}  
               Thanks` 
          
    }; 
      
    transporter.sendMail(mailConfigurations, function(error, info){ 
        if (error) throw Error(error); 
        console.log('Email Sent Successfully'); 
        console.log(info); 
    }); 
}

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