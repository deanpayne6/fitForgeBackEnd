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

//importing verifyToken

const auth = require("./middleware/auth");



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

app.use((req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database Connection Error" });
    }
    req.mysqlConnection = connection;
    next();
  });
});

// Welcome
app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// Login
app.post("/login", async (req, res) => {
// our login logic goes here

  const user = req.body;
  console.log(user)
  const password_check = user.password_hash;
  console.log(password_check);

  const username = user.username;
  console.log(username);

  // check if username exists
  const query = "SELECT * FROM users where user_id = '6'";
  // get ready to store hashed pass
  let hashed_pass;
  req.mysqlConnection.query(query, [username], (error, results) => {
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
        console.log(data.password_hash)
        console.log(hashed_pass)
        // compare passwords
        bcrypt.compare(password_check, hashed_pass, (compareError, isMatch) => {
          if (compareError) {
            console.error(compareError);
            return res.status(500).json({ error: "Server Error" });
          }
          // if passwords match, authenticate
          if (isMatch) {
            // Passwords match, you can proceed with authentication
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
  
  // Our register logic ends here
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
  //encrypt password
  const encryptedPassword = await bcrypt.hash(user.password_hash, 10)  
  //create token
  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  //save user token
  user.token = token;
  // return new user
 
  if (error) {
    console.log(err);
  }
  // else, return a successful run
  else {res.status(201).json(user); }
 

  // unravel JSON object
  const user_data = [user.username, user.emailaddress, user.firstname, user.lastname, encryptedPassword, user.age]
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
      return res.status(200).json({success: true}); // success
    }
  });

 //generate random token for password recovery.
 /*
 async function generateToken() {
   // Generate a unique value, e.g., a timestamp or a random string
  const uniqueValue = Date.now().toString(); // You can use any unique value
  const token = await bcrypt.hash(uniqueValue, 10); // Hash the unique value with bcrypt

  return token;
}
*/
//request password
/*
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user with the provided email address
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a secure token for password reset
    const token = generateToken();

    // Save the token and its expiration time in the user document
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Send a password reset email to the user
    const resetLink = `fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com/reset-password?token=${token}`; // placeholder for now
    const mailOptions = {
      from: 'fitForgeSupport@gmail.com', // placeholder for now
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested a password reset. Please click on the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send reset email' });
      }

      console.log(`Password reset email sent to: ${email}`);
      res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
*/
  // Guys, please send back proper responses for ALL the gets and post requests, there is no way for frontend to verify
  // unless you guys send responses back
    //no

});

// tentative db connection logic



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

module.exports = app;