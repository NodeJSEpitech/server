const env = process.env.NODE_ENV, // eslint-disable-line no-undef
    express = require('express'),
    server = express(),
    parameters = require('../config/parameters'),
    base = require('./router/base'),
    security = require('./router/security'),
    user = require('./router/user'),
    post = require('./router/post');

server
    .use('/', base)
    .use('/', security)
    .use('/', user)
    .use('/', post)
    .listen(parameters.port, () => {
        console.log(`Working on environment ${env}`);
        console.log(`Listening on port ${parameters.port}`);
    });

module.exports = server;
