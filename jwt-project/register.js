require("dotenv").config();
const express = require("express");
const mysql = require("mysql")
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const cors = require("cors")

app.post("/register", async (req,res) => {
  // receive user information
  const user = req.body;
  //encrypt password
  const encryptedPassword = await bcrypt.hash(user.password_hash, 10)  
  // unravel JSON object
  const user_data = [user.username, user.email, user.firstname, user.lastname, encryptedPassword, user.age]
  // insert statement
  const query = "insert into fitforge.users (username, email, firstname, lastname, password_hash, age) VALUES (?, ?, ?, ?, ?, ?)";

  // db connection and statement execution
  pool.mysqlConnection.query(query, user_data, (error, results) => {
    // if query does not work, handle error here
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
    // else, return a successful run
    else {
      return res.status(200).json({success: true}); // success
    }
  });

  // Guys, please send back proper responses for ALL the gets and post requests, there is no way for frontend to verify
  // unless you guys send responses back
    //no

});