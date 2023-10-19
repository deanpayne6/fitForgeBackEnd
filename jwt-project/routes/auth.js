const express = require('express');
const bcrypt = require("bcrypt");
const db = require("../db_connect");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Happy New Year");
});

const secretKey = 'luisdumb'

router.post('/login', async (req, res) => {
  const password_check = req.body.password;
  const email = req.body.email;
  const query = "SELECT * FROM users where emailaddress = ?";
  
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

  jwt.sign({ user_id }, secretKey, {expiresIn: '1h'}, (err, token) => {
    if (err) {
      res.status(500).json({ error: 'Failed to create token' });
    } else {
      res.status(201).json({ token });
    }
  });

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

module.exports = router;