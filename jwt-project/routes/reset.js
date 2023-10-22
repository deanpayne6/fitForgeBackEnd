const express = require('express');
const bcrypt = require("bcrypt");
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const  verifyToken  = require("../middleware/auth");
const router = express.Router();
const secretKey = require('../config/secretKey');
const nodemailer = require('nodemailer'); 


//passwordRecovery
router.post('/passwordRecovery', async (req, res) =>{

});
//sendEmail

//ChangePassword
router.post('/changePassword', async (req, rex)=>{
  
  const email = req.body.email;
  
    const result = await db.query("SELECT user_id FROM users WHERE emailaddress = ?", email);
    checkUser(email);
        if (err) { 
            res.send(err); 
        } else { 
            user.changePassword(req.body.oldpassword,  
            req.body.newpassword, function (err) { 
                if (err) { 
                    res.send(err); 
                } else { 
                    
                    res.send('Successfully changed password') 
                } 
            }); 
        } 
    }); 

//verifyToken
router.get('/verify/:token', async (req, res) => {
    const {token} = req.params; 
  
    // Verifying the JWT token  
    jwt.verify(token, secretKey, function(err, decoded) { 
        if (err) { 
            console.log(err); 
            res.send("Email verification failed, possibly the link is invalid or expired"); 
        } 
        else { res.send("Email verifified successfully"); 
        } 
    }); 
});
// Email Verification
async function verify_email(email){
    const transporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: secure_configuration.EMAIL_USERNAME, //dummy data and needs to be added when we have a support email
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