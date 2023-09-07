const mongoose = require("mongoose");

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
};