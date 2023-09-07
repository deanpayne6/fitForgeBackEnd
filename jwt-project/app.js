require("dotenv").config();
const express = require("express");
const mysql = require("mysql")
const app = express();
const cors = require('cors');

// app.use(express.json());

// tentative db connection logic
const pool = mysql.createPool({
  host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
  user: "fitforge",
  password: "fitforge",
  port: "3306",
  database: "fitforge"
});

// Middleware to handle MySQL connections
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

    // Release the connection
    //req.mysqlConnection.release();

    if (results.length > 0) {
      res.status(200).json({ exists: true }); // Email exists
    } else {
      res.status(200).json({ exists: false }); // Email does not exist
    }
  });
});

app.get("/checkUsernameAvailability", (req, res) => {
  const { username } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  req.mysqlConnection.query(query, [username], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }

    // Release the connection
    //req.mysqlConnection.release();

    if (results.length > 0) {
      res.status(200).json({ exists: true }); // Email exists
    } else {
      res.status(200).json({ exists: false }); // Email does not exist
    }
  });
});



module.exports = app;



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


// // Login
// app.post("/login", async (req, res) => {
// // our login logic goes here
// try {
//     // Get user input
//     const {  email, password } = req.body;

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
  
//   // Our register logic ends here
// });

// app.get("/getlogindata", async (req, res) => {
//   const query = 'SELECT * FROM users';
//   pool.query(query, (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Failed to execute query' });
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/checkEmailAvailability", async (req, res) => {
//   let query = 'select email from users where email = ' + req.email
//   pool.query(query, (error, results) => {
//     try{
//     if(results = req.email) {
//       res.status(200).json({exists: true});
//     }else{
//       res.status(500).json({exists:false});
//     }}catch (err){
//       console.error(err);
//     }
//   });
// });


// app.get("/checkEmailAvailability", (req, res) => {
//   const { email } = req.query;

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   const query = "SELECT * FROM users WHERE email = ?";
//   pool.query(query, [email], (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Server Error" });
//     }
  
//     if (results.length > 0) {
//       res.status(200).json({ exists: true }); // Email exists
//     } else {
//       res.status(200).json({ exists: false }); // Email does not exist
//     }
//   });
// });