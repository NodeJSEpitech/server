const express = require('express'),
    session = require('express-session'),
    app = express(),
    parameters = require('./config/parameters'),
    security = require('./src/security'),
    user = require('./src/user'),
    database = require('./src/database');

database.connect();

app
    .use(session({
        secret: parameters.secret
    }))

    .get('/', (req, res) => res.json({"success": true, "message": "EpiBlog API server"}))
    .get('/user/create', user.create)
    .get('/security/authenticate', security.authenticate)

    .use(security.check_authentication)
    // .get('/user/get', user.get)

    .listen(parameters.port, () => {
        console.log(`Listening on ${parameters.port}`);
    })
    .on('close', () => {
        console.log('Closing server...');
        database.disconnect();
        console.log('Server closed');
    })
;
