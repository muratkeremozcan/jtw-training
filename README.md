## JSON web token training.

From [tutorial](https://www.youtube.com/watch?v=x5gLL8-M9Fo&feature=youtu.be).

[What is a JWT (Json Web Token)?](h"ttps://jwt.io/introduction/) 
*Compact and self-contained way for securely transmitting information between parties as a JSON object*

[When is JWT used?](https://jwt.io/introduction/)
***Authorization**: This is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. Single Sign On is a feature that widely uses JWT nowadays, because of its small overhead and its ability to be easily used across different domains.*

[What are refresh and access tokens?](https://stackoverflow.com/questions/3487991/why-does-oauth-v2-have-both-access-and-refresh-tokens)

* To gain an access token; refresh token, client id, client secret are required.

* Refresh token can be used by a third party that can renew the access token without any knowledge of user credentials.

* If an access token is compromised, because it is short-lived, an attacker has a limited window in which to abuse it. Refresh tokens, if compromised, are useless because the attacker requires the client id & secret and the refresh token in order to gain an access token.

* Refresh tokens mitigate the risk of a long-lived access_token leaking (query param in a log file on an insecure resource server, beta or poorly coded resource server app, JS SDK client on a non https site that puts the access_token in a cookie, etc).

## Running the application

`npm i` under server folder, then start the server (under server folder, runs on port 4000):
```bash
npm start
```

Sanity test with test.rest file @createUser. It should respond with the new user being added, or rejected because it already exists:
```bash
server listening on port 4000
[ { id: 0,
    email: 'thomas.weibenfalk@gmail.com',
    password:
     '$2a$10$KatFuvPCbaSCMnEzPG/n9uV0ueIZMQSh6SJq/dmbhMIGZTOtpvXYe' },
  { id: 1,
    email: 'murat.hey@gmail.com',
    password:
     '$2a$10$1KSDN7SET1xEtqAC1rJCjuftf1x5gUrF7wD5NksdYlFsNyM3m9NSi' } ]
```

Sanity test the rest of the `test.rest` file top to bottom. You may need vscode REST Client extension.

`npm i` in the front-end folder, then start the front-end  app (under frontend folder, runs on port 3000);
```bash
npm start
```