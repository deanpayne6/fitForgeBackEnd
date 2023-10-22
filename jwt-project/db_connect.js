// future file for db connection
const mysql = require("mysql");
const user = require("./models/user");


const db = mysql.createConnection({
  host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
  user: "fitforge",
  password: "fitforge",
  port: "3306",
  database: "fitforge"
});


function query(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function queryUserData(dataType, email) {
  
  const query = `SELECT ${dataType} FROM users WHERE emailaddress = '${email}'`;
  const results = this.query(query);
  return results;
  
}

async function getUser(email) {

  const query = `
    SELECT
    username, firstname, lastname, age
    FROM users
    WHERE emailaddress = '${email}'
  `
  const results = await this.query(query);

  const user_returned = new user(email, results[0].username, results[0].firstname, results[0].lastname, results[0].age);

  return user_returned;

}

module.exports = {
  query,
  queryUserData,
  getUser
};