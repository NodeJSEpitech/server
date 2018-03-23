const express = require('express'),
    app = express(),
    variables = require('./config/parameters'),
    security = require('./src/security'),
    user = require('./src/user'),
    {port} = variables
;

app
    .get('/', (req, res) => {
        res.json({
            "success": true,
            "message": "Hello World"
        });
    })
;

app
    .get('/user/create', user.create)
    .get('/security/authenticate', security.authenticate)
;

app
    .use(security.check_authentication)
    .get('/user/get', user.get)
;

app
    .listen(port, () => console.log(`Listening on ${port}`))
;
