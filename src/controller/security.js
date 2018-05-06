const database = require('../service/database'),
    jwt = require('jsonwebtoken'),
    hasher = require('password-hash'),
    {secret} = require('../../config/parameters'),
    {status, messages} = require('../../config/variables');

function authenticate(request, response) {
    const {username, password} = request.body;
    let user = null,
        payload = null,
        token = null;

    if (!username || !password) {
        response.status(status.ko.badrequest).json({'message': messages.error.security.bad_credentials});
        return false;
    }
    database.findBy('user', {'username': username}).then((users) => {
        if (users.length !== 1) {
            response.status(status.ko.badrequest).json({'message': messages.error.security.bad_credentials});
            return false;
        }
        user = users[0];
        if (user.deleted_at || hasher.verify(password, user.password) === false) {
            response.status(status.ko.badrequest).json({'message': messages.error.security.bad_credentials});
            return false;
        }
        database.update('user', {'is_authenticated': 1}, {'id': user.id}).then((authenticatedUsers) => {
            if (authenticatedUsers.affectedRows !== 1) {
                response.status(status.ko.badrequest).json({'message': messages.error.fallback});
                return false;
            }
            payload = Object.assign({}, user, {'password': 'hidden'});
            token = jwt.sign(payload, secret);
            response.status(status.ok).json({
                'message': messages.success.security.authenticated,
                'data': {'token': token}
            });
            return true;
        });
        return false;
    });
    return false;
}

function logout(request, response) {
    database.update('user', {'is_authenticated': 0}, {'id': request.user.id}).then((users) => {
        if (users.affectedRows !== 1) {
            response.status(status.ko.server).json({'message': messages.error.fallback});
            return false;
        }
        response.status(status.ok).json({'message': messages.success.security.logout});
        return true;
    });
    return false;
}

module.exports = {
    'authenticate': authenticate,
    'logout': logout
};
