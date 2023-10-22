require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const updateWorkout = require("./workout/updateWorkout")
const generateWorkout = require("./workout/generateWorkout");
const workoutLog = require("./workout/workoutLog");
const authRoute = require("./routes/auth");
const questionnaireRoute = require("./routes/questionnaire");
const resetRoute = require("./routes/reset");
const getRoute = require("./routes/get");
const cookieParser = require("cookie-parser");

app.use(express.json());

// importing user context
const User = require("./models/user");

//importing verifyToken

const auth = require("./middleware/auth");

app.use(cors());
app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/questionnaire', questionnaireRoute);
app.use('/get', getRoute);
// app.use('/reset', resetRoute);


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


app.use((req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database Connection Error" });
    }
    req.mysqlConnection = connection;
    next();
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



app.post("/generateWorkout", (req, res) => {
  generateWorkout.generateWorkout(req, res);
})

app.post("/workoutLog", (req, res) => {
  workoutLog.workoutLog(req, res);
})

app.post("/submitWorkout", (req, res) => {
  workoutLog.submitWorkout(req, res)
})

app.post("/updateWorkout", (req, res) => {
  updateWorkout.updateWorkout(req, res)
})

app.post("/sendMuscleSwap", (req, res) => {
  updateWorkout.sendMuscleSwap(req, res)
})

module.exports = app;