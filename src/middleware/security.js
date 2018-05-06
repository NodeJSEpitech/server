const database = require('../service/database.js'),
    jwt = require('jsonwebtoken'),
    {secret} = require('../../config/parameters'),
    {status, messages} = require('../../config/variables');

function check(request, response, next) {
    const token = request.headers['x-authentication-token'];

    if (!token) {
        response.status(status.ko.badrequest).json({'message': messages.error.security.missing_token});
        return false;
    }
    jwt.verify(token, secret, (error, user) => {
        if (error) {
            response.status(status.ko.unauthorized).json({'message': messages.error.security.unauthorized});
            return false;
        }
        database.findBy('user', {'id': user.id}).then((users) => {
            if (users.length !== 1 || !users[0].is_authenticated || users[0].deleted_at) {
                response.status(status.ko.unauthorized).json({'message': messages.error.security.unauthorized});
                return false;
            }
            request.user = Object.assign({}, users[0], {'password': 'hidden'});
            next();
            return true;
        });
        return false;
    });
    return false;
}

module.exports = {
    'check': check
};
