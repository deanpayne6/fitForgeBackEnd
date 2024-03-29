/* Login
app.post("/login", async (req, res) => {
  const user = req.body;
  const password_check = user.password;

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
            /*     CREATE TOKEN HERE    
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


}); */


// app.post("/register", async (req,res) => {
  
//   // receive user information
//   const user = req.body;
//   console.log(user);
  
//   //encrypt password
//   const encryptedPassword = await bcrypt.hash(user.password, 10); 

//   // unravel JSON object
//   const user_data = [user.username, user.email, user.first_name, user.last_name, encryptedPassword, user.age]
//   // insert statement
//   const query = "insert into fitforge.users (username, emailaddress, firstname, lastname, password_hash, age) VALUES (?, ?, ?, ?, ?, ?)";

//   // db connection and statement execution
//   req.mysqlConnection.query(query, user_data, (error, results) => {
//     // if query does not work, handle error here
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Server Error" });
//     }
//     // else, return a successful run
//     else {
//       // 201 means creation is true
//       return res.status(201).json({success: true}); // success
//     }
//   });
// });

//Old workoutLog code
// async function workoutLog(username, dateRequested) {
//   user_id = 0
//   tempLog = []
//   sortedLog = []
//   queryData = []
  
//   const userQuery = "SELECT * FROM users WHERE username = ?"
//   const workoutQuery = "SELECT name, musclegroup, sets, reps, rest, rating FROM workoutplan_exercises INNER JOIN exercises ON workoutplan_exercises.exercise_id = exercises.exercise_id WHERE (workoutplan_exercises.user_id = ?) and (workoutplan_exercises.day = ?)"
  
//   let userData = await db.query(userQuery, username)
//   if(userData.length > 0)
//     user_id = userData[0].user_id
//   else
//     return ["Invalid Username", sortedLog] 

//   for(let j = 0; j < dateRequested.length; j++){
//     holdWorkoutData = await db.query(workoutQuery, [user_id, dateRequested[j]])
//     for(let i = 0; i < holdWorkoutData.length; i++){
//       tempData = setWorkoutInfo(holdWorkoutData[i])
//       tempLog.push(tempData)
//     }
//     sortedLog.push(tempLog)
//     tempLog = []
//   }
//   return ["Success", sortedLog]
// }