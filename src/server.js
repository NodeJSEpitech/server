const express = require('express'),
    parameters = require('../config/parameters'),
    env = process.env.NODE_ENV, // eslint-disable-line no-undef
    base = require('./router/base'),
    security = require('./router/security'),
    user = require('./router/user'),
    server = express();

server
    .use('/', base)
    .use('/', security)
    .use('/', user)
    .listen(parameters.port, () => {
        console.log(`Working on environment ${env}`);
        console.log(`Listening on port ${parameters.port}`);
    });

module.exports = server;
