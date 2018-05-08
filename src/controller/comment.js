const database = require('../service/database'),
    mysql = require('mysql'),
    {status, messages} = require('../../config/variables');

function handleError(ws) {
    const response = {
        'status': status.ko.badrequest,
        'message': messages.error.comment.bad_request
    };
    ws.send(JSON.stringify(response));
}

function getComments(ws, request) {
    const response = {
            'x-request-id': request.id,
            'status': status.ok,
            'message': null,
            'data': null
        },
        user = database.getFinalTable('user'),
        comment = database.getFinalTable('comment');

    database
        .query(`SELECT u.firstname AS firstname, u.lastname AS lastname, u.avatar AS avatar,
                c.content AS content, c.created_at AS created_at
                FROM ${comment} AS c INNER JOIN ${user} AS u ON c.creator_id = u.id
                WHERE c.post_id = ${mysql.escape(request.post)} AND c.deleted_at IS NULL
                ORDER BY created_at DESC`)
        .then((comments) => {
            response.message = messages.success.comment.get;
            response.data = comments;
            ws.send(JSON.stringify(response));
        })
        .catch(() => {
            response.status = status.ko.server;
            response.message = messages.error.fallback;
            ws.send(JSON.stringify(response));
        });
}

function postComment(ws, request) {
    const response = {
            'x-request-id': request.id,
            'status': status.ok,
            'message': null,
            'data': null
        },
        user = database.getFinalTable('user'),
        post = database.getFinalTable('post'),
        comment = database.getFinalTable('comment');

    database
        .query(`INSERT INTO ${comment} VALUES (
                NULL,
                (SELECT id FROM ${post} WHERE id = ${mysql.escape(request.post)}),
                (SELECT id FROM ${user} WHERE id = ${mysql.escape(request.user.id)} AND deleted_at IS NULL AND is_authenticated = 1),
                ${mysql.escape(request.content)},
                NULL,
                NULL)`)
        .then(() => {
            response.message = messages.success.comment.post;
            ws.send(JSON.stringify(response));
        })
        .catch(() => {
            response.status = status.ko.server;
            response.message = messages.error.fallback;
            ws.send(JSON.stringify(response));
        });
}

function postMessage(ws, request, clients) {
    const response = {
        'avatar': null,
        'username': request.username,
        'content': request.content
    };

    if (request.user) {
        response.username = request.user.username;
        response.avatar = request.user.avatar;
    }
    clients.forEach((client) => {
        client.send(JSON.stringify(response));
    });
}

function handleRequest(ws, request, clients) {
    if (request.method === 'get') {
        getComments(ws, request);
    } else {
        if (request.post === null) {
            postMessage(ws, request, clients);
        } else {
            postComment(ws, request);
        }
    }
}

module.exports = {
    'handleError': handleError,
    'handleRequest': handleRequest
};
