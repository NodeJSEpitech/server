const jwt = require('jsonwebtoken'),
    {secret} = require('../../config/parameters'),
    {status, messages} = require('../../config/variables');

function check(request, response, next) {
    const token = request.headers['x-authentication-token'];

    if (!token) {
        response.status(status.ko.badrequest).json({'message': messages.error.security.missing_token});
    } else {
        jwt.verify(token, secret, (error, user) => {
            if (error) {
                response.status(status.ko.unauthorized).json({'message': messages.error.security.unauthorized});
            } else {
                request.user = user;
                next();
                return true;
            }
            return false;
        });
    }
}

module.exports = {
    'check': check
};
