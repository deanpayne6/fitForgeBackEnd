const express = require('express');
const bcrypt = require("bcrypt");
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const  verifyToken  = require("../middleware/auth");
const router = express.Router();
const cookieParser = require("cookie-parser");
const secretKey = require('../config/secretKey');


router.get('/', (req, res) => {
  res.send("Happy New Year");
});


router.post('/login', async (req, res) => {
  const password_check = req.body.password;
  const email = req.body.email;
  
  const userExists = await checkUser(email);
  
  if (!userExists) {
    return res.status(404).send("Invalid user.");
  }

  const passwordMatch = await checkPass(email, password_check);

  if (!passwordMatch) {
    return res.status(404).send("Invalid password.")
  }

  const useridquery = "SELECT user_id FROM users where emailaddress = ?";
  let user_id = await db.query(useridquery, email);
  user_id = (user_id[0].user_id)

  const token = jwt.sign({ user_id }, secretKey);
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({message: "Logged in was successfull" });
  });

router.post('/logout', verifyToken, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Logged off" });
});

router.get('/protected', verifyToken, (req, res) => {
  const userId = req.user.user_id; // Access the user ID from the request object
  res.json({ userId});
});

router.post('/register', async (req, res) => {
  // receive user information
  const user = req.body;  
  const encryptedPassword = await bcrypt.hash(user.password, 10); 

  // check for duplicates
  if (await checkData(user.username, "username") | await checkData(user.email, "emailaddress")){
    return res.status(400).json({"status": "400"});
  }

  const user_data = [user.username, user.email, user.first_name, user.last_name, encryptedPassword, user.age]

  const query = "insert into fitforge.users (username, emailaddress, firstname, lastname, password_hash, age) VALUES (?, ?, ?, ?, ?, ?)";

  const insert = await db.query(query, user_data);

  return res.status(201).json({"status": "201"})
});

router.post('/updateEmail', async (req, res) => {
  //check password
  const password_check = req.body.password;
  const email = req.body.email;
  const newEmail = req.body.newEmail;
  const updateEmailQuery = "UPDATE users SET emailaddress = ? WHERE user_id = ?";

  const userExists = await checkUser(email);
  
  //check if the email is in use
  if(!checkUser(newEmail))
    return res.status(404).send("Email is already in use.");

  //check if the user exist in db
  if (!userExists) {
    return res.status(404).send("Invalid user.");
  }

  const passwordMatch = await checkPass(email, password_check);

  if (!passwordMatch) {
    return res.status(404).send("Invalid password.")
  }
  //if the password is correct update to a new email
  const useridquery = "SELECT user_id FROM users where emailaddress = ?";
  let user_id = await db.query(useridquery, email);
  try {

  await db.query(updateEmailQuery, [newEmail, user_id]);
  user_id = user_id[0].user_id; // Extract the user_id from the object  
  console.log(`Email address updated successfully for user with ID ${user_id}`);
  
} catch (error) {console.error("Error updating email address:", error); }
});

router.post('/updatePassword', async (req, res) => {
  //Still has isssue with sql query.
  //check password
  const password_check = req.body.password;
  const email = req.body.email;
  const newPassword = req.body.newEmail;
  const updatePasswordQuery = 'UPDATE users SET password_hash = ? WHERE emailaddress = ?';

  const userExists = await checkUser(email);
  
  //check if the user exist in db
  if (!userExists) {
    return res.status(404).send("Invalid user.");
  }

  const passwordMatch = await checkPass(email, password_check);

  if (!passwordMatch) {
    return res.status(404).send("Invalid password.")
  }
  //if the password is correct update to a new password

  const new_password_hash = await bcrypt.hash(newPassword, 10); //create hash of new password

  const useridquery = "SELECT user_id FROM users where emailaddress = ?";
  
  let user_id = await db.query(useridquery, email);
  user_id = user_id[0].user_id; // Extract the user_id from the object
  await db.query(updatePasswordQuery, [hashedPassword, email]);
  try {
    console.log(`Password updated successfully for user with email: ${email}`);
    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


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