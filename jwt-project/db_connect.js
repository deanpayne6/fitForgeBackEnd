// future file for db connection
const mysql = require("mysql");

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
    username, first_name, last_name, age
    FROM users
    WHERE emailaddress = '${email}'
  `
  const results = await this.query(query);

  return results;

}

module.exports = {
  query,
  queryUserData,
  getUser
};