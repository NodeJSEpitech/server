const database = require('../model/database'),
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
    } else {
        database.findBy('user', {'username': username}).then((results) => {
            if (results.length !== 1) {
                response.status(status.ko.badrequest).json({'message': messages.error.security.bad_credentials});
            } else {
                user = results[0];
                if (hasher.verify(password, user.password) === false) {
                    response.status(status.ko.badrequest).json({'message': messages.error.security.bad_credentials});
                } else {
                    payload = Object.assign({}, user, {'password': 'hidden'});
                    token = jwt.sign(payload, secret);
                    response.status(status.ok).json({
                        'message': messages.success.security.authenticated,
                        'data': {'token': token}
                    });
                }
            }
        });
    }
}

function check(request, response, next) {
    const {token} = request.body;

    if (!token) {
        response.status(status.ko.badrequest).json({'message': messages.error.security.missing_token});
    } else {
        jwt.verify(token, secret, (error, user) => {
            if (error) {
                response.status(status.ko.unauthorized).json({'message': messages.error.security.unauthorized});
            } else {
                request.user = user;
                next();
                return 1;
            }
            return 0;
        });
    }
}

module.exports = {
    'authenticate': authenticate,
    'check': check
};
