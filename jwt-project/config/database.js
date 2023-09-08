/*const mongoose = require("mongoose");

const { DB_HOST } = process.env;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};*/

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
  user: "fitforge",
  password: "fitforge"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});