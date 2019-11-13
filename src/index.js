require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');

const { fakeDB } = require('./fakeDB.js');

// 1. Register a user
// 2. Login a user
// 3. Logout the user
// 4. setup a protected route
// 5. get a new access token with a refresh token

// create express server
const server = express();

// use express middleware for easier cookie handling
server.use(cookieParser());

// front-end on 3000, this will make sure front-end server can communicate with each other
server.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

// Configuration for Express server: needed to be able to ready body data
server.use(express.json()); // to support JSON-encoded bodies
server.use(express.urlencoded({ extended: true })); // support URL-encoded bodies


// 1. Register a user
server.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. check if the user exists
    const user = fakeDB.find(user => user.email === email);
    if (user) throw new Error ('user already exists');
    // 2. If not user exists, hash the password
    const hashedPassword = await hash(password, 10);
    // 3. Insert the user in the database
    fakeDB.push({
      id: fakeDB.length, // add it to the end
      email,
      password: hashedPassword
    });
    res.send({
      message: 'User Created'
    });
    console.log(fakeDB);
  } catch (err) {
    res.send({
      error: `${err.message}`
    })
  }
});

// 2. Login a user
server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user in database. If not exists, send error
    const user = fakeDB.find(user => user.email === email);
    if (!user) throw new Error('user does not exist');
    // 2. Compare crypted password, see if it checks out. Send error if not
    const valid = await compare(password, user.password);
    if(!valid) throw new Error('password not correct');
    // 3. If user exists and password is correct, Create Refresh and Access token
    // Access token should have short life time, Refresh should have long life time
    // const accessToken = 
    // const refreshToken =  
  } catch (err) {

  }
});

// server on port 4000
server.listen(process.env.PORT, () =>
  console.log(`server listening on port ${process.env.PORT}`)
);