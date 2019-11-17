require('dotenv/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verify } = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require('./tokens.js');
const { fakeDB } = require('./fakeDB.js');
const { isAuthorized } = require('./isAuth.js');

// 1. Register a user
// 2. Login a user
// 3. Logout a user
// 4. Setup a protected route
// 5. Get a new accesstoken with a refresh token

const server = express();

// Use express middleware for easier cookie handling
server.use(cookieParser());

server.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// Needed to be able to read body data
server.use(express.json()); // to support JSON-encoded bodies
server.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// 1. Register a user
server.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the user exist
    const user = fakeDB.find(user => user.email === email);
    if (user) throw new Error('User already exists');
    // 2. If no user exists, hash the password
    const hashedPassword = await hash(password, 10);
    // 3. Insert the user in "database"
    fakeDB.push({
      id: fakeDB.length,
      email,
      password: hashedPassword,
    });
    res.send({ message: 'User Created' });
    console.log(fakeDB);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 2. Login a user
server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user in array. If not existing, send error
    const user = fakeDB.find(user => user.email === email);
    if (!user) throw new Error('User does not exist');
    // 2. If the user exists, compare crypted password and see if it checks out. Send error if not
    const validPw = await compare(password, user.password);
    if (!validPw) throw new Error('Password not correct');
    // 3. User exists, password ok, now create refresh(long) and access (short) tokens
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);
    // 4. Store Refreshtoken with user in "db"
    // Could also use different version numbers instead.
    // Then just increase the version number on the revoke endpoint
    user.refreshtoken = refreshtoken;
    // 5. Send tokens. Refreshtoken as a cookie and accesstoken as a regular response
    sendRefreshToken(res, refreshtoken);
    sendAccessToken(req, res, accesstoken);
    console.log(fakeDB);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 3. Logout a user
server.post('/logout', (_req, res) => {
  // sendRefreshToken sends the refresh to to the /refresh_token path also; make sure to clear it too
  res.clearCookie('refreshtoken', { path: '/refresh_token' });
  // Logic here for also remove refreshtoken from db
  console.log(fakeDB);
  return res.send({
    message: 'Logged out',
  });
});

// 4. Protected route
server.post('/protected', async (req, res) => {
  try {
    if (isAuthorized(req) !== null) {
      res.send({
        data: 'You are authorized, but This is protected data.',
      });
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 5. Get a new access & refresh tokens
server.post('/refresh_token', (req, res) => {
  // if we are refreshing, we must have a userAccessToken in our request, lets check that
  const token = req.cookies.refreshtoken;
  // If we don't have a token in our request
  if (!token) return res.send({ message: 'you do not have a valid refresh token in your request, you should login first' });
  // We have a token, let's verify it!
  let verifiedToken = null;
  try {
    verifiedToken = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({ message: 'your token could not be verified' });
  }
  // verify returns { userId: 1, iat: 1573986745, exp: 1574591545 }
  console.log(verifiedToken);
  // token is valid, check if the user exists
  const user = fakeDB.find(user => user.id === verifiedToken.userId);
  if (!user) return res.send({ accesstoken: 'the user does not exist, create it first' });
  // user exists, check if refreshtoken exists on user
  if (user.refreshtoken !== token)
    return res.send({ accesstoken: 'refresh token does not exist, you should login first' });
  // token exists, create new Refresh and Access tokens
  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);
  // update refreshtoken on user in db
  // Could have different versions instead!
  user.refreshtoken = refreshtoken;
  // All good to go, send new refreshtoken and accesstoken
  console.log(fakeDB);
  sendRefreshToken(res, refreshtoken);
  return res.send({ accesstoken });
});

server.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}!`),
);