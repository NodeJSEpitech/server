const express = require('express'),
    security = require('./src/model/security'),
    database = require('./src/model/database'),
    // user = require('./src/controller/user'),
    // post = require('./src/post'),
    // comment = require('./src/comment'),
    parameters = require('./config/parameters'),
    {status} = require('./config/variables'),
    app = express()
;

database.connect();

app
    // dev
    .post('/generate', security.generate)

    .get('/', (request, response) => response.status(status.ok).json({'message': 'Welcome to EpiBlog API server'}))
    .post('/authenticate', security.authenticate)

    .use(security.checkAuthentication)

    // .get('/users/:id(\d+)', user.get)
    // .post('/users', user.create)
    // .patch('/users/:id(\d+)', user.update)
    // .delete('/users/:id(\d+)', user.delete)
    //
    // .get('/posts/:id(\d+)', post.get)
    // .post('/posts', post.create)
    // .patch('/posts/:id(\d+)', post.update)
    // .delete('/posts/:id(\d+)', post.delete)
    //
    // .post('/posts/:id(\d+)/comments', comment.create)
    // .patch('/posts/:id(\d+)/comments/:id(\d+)', comment.update)
    // .delete('/posts/:id(\d+)/comments/:id(\d+)', comment.delete)

    .use((error, request, response, next) => response.status(status.ko.server).json({'message': 'An error occurred'}))
    .listen(parameters.port, () => {
        console.log(`Listening on ${parameters.port}`);
    })

    .on('close', () => database.disconnect())
;
