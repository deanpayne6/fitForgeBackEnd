require("dotenv").config();
const express = require("express");
const mysql = require("mysql")
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const cors = require("cors")


app.use(express.json());

// importing user context
const User = require("./model/user");

// Welcome
// app.post("/welcome", auth, (req, res) => {
//   res.status(200).send("Welcome 🙌 ");
// });

// // Register
//   app.post("/register", async (req,  res) => {
//     try {
//         // Get user input
//         const { first_name, last_name, email, password } = req.body;
        
    
//         // Validate user input
//         if (!(email && password && first_name && last_name)) {
//           res.status(400).send("All input is required");
//         }
    
//         // check if user already exist
//         // Validate if user exist in our database
//         const oldUser = await User.findOne({ email });
    
//         if (oldUser) {
//           return res.status(409).send("User Already Exist. Please Login");
//         }
    
//         //Encrypt user password
//         const encryptedPassword = await bcrypt.hash(password, 10);
    
//         // Create user in our database
//         const user = await User.create({
//           first_name,
//           last_name,
//           email: email.toLowerCase(), // sanitize: convert email to lowercase
//           password: encryptedPassword,
//         });
    
//         // Create token
//         const token = jwt.sign(
//           { user_id: user._id, email },
//           "" + process.env.TOKEN_KEY,
//           {
//             expiresIn: "2h",
//           }
//         );
//         // save user token
//         user.token = token;
    
//         // return new user
//         res.status(201).json(user);
//       } catch (err) {
//         console.log(err);
//         res.status(500).send("Server Error");
//       }
//       // Our register logic ends here
// });

const pool = mysql.createPool({
  host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
  user: "fitforge",
  password: "fitforge",
  port: "3306",
  database: "fitforge"
});

// Login
app.post("/login", async (req, res) => {
// our login logic goes here

  const user = req.body;
  
  const password_check = user.password_hash;

  const user_data = [user.username, user.password_hash];

  // check if username exists
  const query = "SELECT username FROM users where username = ?";
 
  

  // compare password to hashed password for said username

  // if username exists and password hash matches, generate a login token with a success code

// try {
//     // Get user input
//     const user1 = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }
//     // Validate if user exist in our database
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Create token
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         "" + process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );

//       // save user token
//       user.token = token;

//       // user
//       res.status(200).json(user);
//     }
//     res.status(400).send("Invalid Credentials");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Server Error");
//   }
  
  // Our regi     ster logic ends here
});

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

// tentative db connection logic

app.use((req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database Connection Error" });
    }
    req.mysqlConnection = connection;
    next();
  });
});

app.use(cors());



app.get("/checkEmailAvailability", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
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

  const query = "SELECT * FROM usrs WHERE username = ?";
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

module.exports = app;