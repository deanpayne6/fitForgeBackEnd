const express = require('express');
const bcrypt = require("bcrypt");
const db = require("../db_connect")
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Happy New Year");
});

router.post('/login', async (req, res) => {
  const password_check = req.body.password;
  const email = req.body.email;
  const query = "SELECT * FROM users where emailaddress = ?";
  result = await checkUser(email);
});


async function checkUser(email) {
  const result = await db.query("SELECT user_id FROM users WHERE emailaddress = ?", email);
  console.log(result)
  if (result.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

async function checkPass(password) {

  const password = await bcrypt.hash(password, 10)
  console.log(password)
  const result = await db.query("SELECT * FROM users WHERE password_hash = ?", password);

  console.log(result)

  if (result.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

module.exports = router;