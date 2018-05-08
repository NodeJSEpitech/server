const jwt = require('jsonwebtoken'),
    {secret} = require('../../config/parameters'),
    {regexps} = require('../../config/variables');

function getUserFromToken(token) {
    try {
        return token ? jwt.verify(token, secret) : null;
    } catch (error) {
        return null;
    }
}

function handleMessage(message) {
    try {
        const data = JSON.parse(message),
            request = {
                'error': false,
                'user': null,
                'id': data['x-request-id'] ? data['x-request-id'] : null,
                'method': data['x-method'] ? data['x-method'] : null,
                'post': data['x-post-id'] ? data['x-post-id'] : null,
                'username': data['x-username'] ? data['x-username'] : null,
                'content': data.body ? data.body : null
            };

        request.user = getUserFromToken(data['x-authenticated-token']);
        request.error =
            (regexps.method.test(request.method) === false) ||
            (request.method === 'get' && request.post === null) ||
            (request.method === 'post' && request.content === null) ||
            (request.method === 'post' && request.post !== null && request.user === null) ||
            (request.method === 'post' && request.post === null && request.user === null && request.username === null);
        return request;
    } catch (error) {
        return {'error': true};
    }
}

module.exports = {
    'handleMessage': handleMessage
};
