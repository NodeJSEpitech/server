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

// http server
httpServer
    .use('/', base)
    .use('/', security)
    .use('/', user)
    .use('/', post);

httpServer.listen(parameters.httpPort, () => {
    console.log(`Http server listening on port ${parameters.httpPort}`);
});

// ws server
wsServer
    .on('connection', comment.handleConnection);

server.listen(parameters.wsPort, () => {
    console.log(`WebSocket server listening on port ${parameters.wsPort}`);
});

module.exports = httpServer;
