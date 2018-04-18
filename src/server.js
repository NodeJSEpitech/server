const express = require('express'),
    parser = require('body-parser'),
    security = require('./controller/security'),
    user = require('./controller/user'),
    // post = require('./src/post'),
    // comment = require('./src/comment'),
    parameters = require('../config/parameters'),
    {status, messages} = require('../config/variables'),
    env = process.env.NODE_ENV, // eslint-disable-line no-undef
    server = express()
;

server
    .use(parser.json())

    .get('/', (request, response) => response.status(status.ok).json({'message': messages.success.welcome.unauth}))
    .post('/authenticate', security.authenticate)
    .post('/users', user.create)

    .use(security.check)

    .get('/me', (request, response) => response.status(status.ok).json({
        'message': messages.success.welcome.auth,
        'data': request.user
    }))
    .get('/users/:id(\d+)', user.get)
    .patch('/users/:id(\d+)', user.update)
    .delete('/users/:id(\d+)', user.remove)

    // .get('/posts/:id(\d+)', post.get)
    // .post('/posts', post.create)
    // .patch('/posts/:id(\d+)', post.update)
    // .delete('/posts/:id(\d+)', post.delete)
    //
    // .post('/posts/:id(\d+)/comments', comment.create)
    // .patch('/posts/:id(\d+)/comments/:id(\d+)', comment.update)
    // .delete('/posts/:id(\d+)/comments/:id(\d+)', comment.delete)

    .use((request, response) => response.status(status.ko.server).json({
        'message': messages.error.fallback
    }))
    .listen(parameters.port, () => {
        console.log(`ENV is ${env}`);
        console.log(`Listening on ${parameters.port}`);
    })
;

module.exports = server;
