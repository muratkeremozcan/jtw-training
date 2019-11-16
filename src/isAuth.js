const { verify } = require('jsonwebtoken');

const isAuthorized = req => {
  // if asking  for protected route, the request has to come with 'Authorization' header
  const authorization = req.headers['authorization'];
  if (!authorization) throw new Error('You need to login.');
  // Based on 'Bearer ksfljrewori384328289398432'
  const token = authorization.split(' ')[1];
  return verify(token, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = {
  isAuthorized
};