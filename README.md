JSON web token training.

https://www.youtube.com/watch?v=x5gLL8-M9Fo&feature=youtu.be

Start the server (port 4000):
```bash
npm start
```

Sanity test with test.rest file @getHashedPw. It should respond with the new user being added, or rejected because it already exists:
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