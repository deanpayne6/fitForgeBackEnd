const express = require('express');
const request = require('supertest');
const request = require('supertest');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await support
const app = require('./app'); // Import your Express app (replace with the actual path)
const chai = require('chai'); // Still trying to figute out what this does.

const expect = chai.expect;

describe('POST /register', () => {
  let connection;

  // Establish a database connection before running tests
  before(async () => {
    connection = await mysql.createConnection({
     
        host: "fitforge.c6jigttrktuk.us-west-1.rds.amazonaws.com",
        user: "fitforge",
        password: "fitforge",
        database: 'fitforge',
      
    });
  });

  // Close the database connection after running tests
  after(async () => {
    await connection.end();
  });

  it('should register a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    };

    // Use Supertest to send a POST request to your Express app
    const response = await request(app)
      .post('/register')
      .send(userData)
      .expect(201); // Expect a 201 status code for successful registration

    // Add additional assertions based on your application's response
    expect(response.body.message).to.equal('Registration successful');

    // Verify that the user was added to the database
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [userData.username]
    );

    expect(users.length).to.equal(1);
  });
});
