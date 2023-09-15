require("dotenv").config();
const express = require("express");
const mysql = require("mysql")
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const cors = require("cors");
const app = require("./app")



app.get("/hello", async (req, res) => {
  res.json( {"hi": "hello"} )
});