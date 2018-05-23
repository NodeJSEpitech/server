const env = process.env.NODE_ENV, // eslint-disable-line no-undef
    http = require('http'),
    websocket = require('ws'),
    express = require('express'),
    httpServer = express(),
    server = http.createServer(httpServer),
    wsServer = new websocket.Server({server}),
    parameters = require('../config/parameters'),
    base = require('./router/base'),
    security = require('./router/security'),
    user = require('./router/user'),
    post = require('./router/post'),
    comment = require('./router/comment');

console.log(`Working on environment ${env}`);

httpServer
    .use('/', base)
    .use('/', security)
    .use('/', user)
    .use('/', post);

wsServer
    .on('connection', comment.handleConnection);

server.listen(parameters.port, () => {
    console.log(`WebSocket and HTTP server listening on port ${parameters.port}`);
});

module.exports = httpServer;
