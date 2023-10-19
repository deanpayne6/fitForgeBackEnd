require("dotenv").config();
const express = require("express");
const mysql = require("mysql")
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const cors = require("cors")
const workout = require("./workout/generateWorkout")
const workoutLog = require("./workout/workoutLog")


app.use(express.json());

// importing user context
const User = require("./models/user");

//importing verifyToken

const auth = require("./middleware/auth");

app.use(cors());



const pool = mysql.createPool({
  host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
  user: "fitforge",
  password: "fitforge",
  port: "3306",
  database: "fitforge"
});

app.use((req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database Connection Error" });
    }
    req.mysqlConnection = connection;
    next();
  });
});

// Sample method for testing
app.get("/", async (req, res) => {
  res.send("THIS PAGE ACTIVE ONG FITFORGE GANG NO CAP ON A STACK TILL I DIE SWOOP")
})

// Login
app.post("/login", async (req, res) => {
  const user = req.body;
  console.log(user)
  const password_check = user.password;
  console.log(password_check);

  // const username = user.username;
  // console.log(username);

  const email = user.email;

  // check if username exists
  const query = "SELECT * FROM users where emailaddress = ?";
  // get ready to store hashed pass
  let hashed_pass;
  req.mysqlConnection.query(query, [email], (error, results) => {
    // if query does not work, handle error here
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
    // else, return a successful run
    else {
      // if there are any results returned, evaluate them
      if (results.length > 0) {
        const data = results[0];
        hashed_pass = data.password_hash;
        // compare passwords
        bcrypt.compare(password_check, hashed_pass, (compareError, isMatch) => {
          if (compareError) {
            console.error(compareError);
            return res.status(500).json({ error: "Server Error" });
          }
          // if passwords match, authenticate
          if (isMatch) {
            // Passwords match, you can proceed with authentication
            console.log("hi")
            res.status(200).json({ authenticated: true });
            /*     CREATE TOKEN HERE    */
          } else {
            // Passwords don't match, authentication failed
            res.status(200).json({ authenticated: false });
          }
        })
      }
      else {
        res.status(200).json({ exists: false }); // Send a response when no results are found 
      }
      

    }
  });


});

app.use((req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database Connection Error" });
    }
    req.mysqlConnection = connection;
    next();
  });
});

app.post("/register", async (req,res) => {
  
  // receive user information
  const user = req.body;
  console.log(user);
  
  //encrypt password
  const encryptedPassword = await bcrypt.hash(user.password, 10); 

  // unravel JSON object
  const user_data = [user.username, user.email, user.first_name, user.last_name, encryptedPassword, user.age]
  // insert statement
  const query = "insert into fitforge.users (username, emailaddress, firstname, lastname, password_hash, age) VALUES (?, ?, ?, ?, ?, ?)";

  // db connection and statement execution
  req.mysqlConnection.query(query, user_data, (error, results) => {
    // if query does not work, handle error here
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
    // else, return a successful run
    else {
      // 201 means creation is true
      return res.status(201).json({success: true}); // success
    }
  });
});

app.get("/checkEmailAvailability", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE emailaddress = ?";
  req.mysqlConnection.query(query, [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }

    if (results.length > 0) {
      res.status(200).json({ exists: true }); // Email exists
    } else {
      res.status(200).json({ exists: false }); // Email does not exist
    }
  });
});

app.get("/checkUsernameAvailability", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  req.mysqlConnection.query(query, [username], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }

    if (results.length > 0) {
      res.status(200).json({ exists: true }); // Email exists
    } else {
      res.status(200).json({ exists: false }); // Email does not exist
    }
  });
});

app.post("/questionnaireSubmission", (req, res) => {
  const { questionnaire } = req.body;
});

app.post("/generateWorkout", (req, res) => {
  workout.generateWorkout(req, res);
})

app.post("/workoutLog", (req, res) => {
  workoutLog.workoutLog(req, res);
})

app.post("/submitWorkout", (req, res) => {
  workoutLog.submitWorkout(req, res)
})

module.exports = app;