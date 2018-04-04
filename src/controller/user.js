const database = require('../model/database.js'),
    hasher = require('password-hash'),
    {status, messages, regexps} = require('../../config/variables');


function isValidEmail(email) {
    return regexps.email.test(email);
}

function isValidPassword(password) {
    return regexps.password.test(password);
}

function create(request, response) {
    const {
        username,
        firstname,
        lastname,
        email,
        password,
        passwordConfirmation
    } = request.body;
    let success = false,
        message = '';

    if (!username) {
        message = messages.error.user.create.missing_field.replace('%field%', 'username');
    } else if (!firstname) {
        message = messages.error.user.create.missing_field.replace('%field%', 'firstname');
    } else if (!lastname) {
        message = messages.error.user.create.missing_field.replace('%field%', 'lastname');
    } else if (!email) {
        message = messages.error.user.create.missing_field.replace('%field%', 'email');
    } else if (isValidEmail(email) === false) {
        message = messages.error.user.create.invalid_email;
    } else if (!password) {
        message = messages.error.user.create.missing_field.replace('%field%', 'password');
    } else if (isValidPassword(password) === false) {
        message = messages.error.user.create.invalid_password;
    } else if (!passwordConfirmation) {
        message = messages.error.user.create.missing_field.replace('%field%', 'passwordConfirmation');
    } else if (password !== passwordConfirmation) {
        message = messages.error.user.create.password_confirmation;
    } else {
        database.findBy('user', {'username': username}, 1).then((results) => {
            if (results.length > 0) {
                response.status(status.ko.badrequest).json({'message': messages.error.user.create.username_exists});
            } else {
                database.findBy('user', {'email': email}).then((results) => {
                    if (results.length > 0) {
                        response.status(status.ko.badrequest).json({'message': messages.error.user.create.email_exists});
                    } else {
                        database.insert('user', {
                            'username': username,
                            'firstname': firstname,
                            'lastname': lastname,
                            'email': email,
                            'password': hasher.generate(password)
                        });
                        response.status(status.ok).json({'message': messages.success.user.create});
                    }
                });
            }
        });
        return;
    }
    response.status(status.ko.badrequest).json({'message': message});
}

function remove(request, response)
{

}

function get(request, response)
{

}

module.exports = {
    'create': create,
    'get': get
};
