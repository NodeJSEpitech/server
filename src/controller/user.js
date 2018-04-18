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
    let message = '';

    if (!username) {
        message = messages.error.user.create.missing_parameter.replace('%parameter%', 'username');
    } else if (!firstname) {
        message = messages.error.user.create.missing_parameter.replace('%parameter%', 'firstname');
    } else if (!lastname) {
        message = messages.error.user.create.missing_parameter.replace('%parameter%', 'lastname');
    } else if (!email) {
        message = messages.error.user.create.missing_parameter.replace('%parameter%', 'email');
    } else if (isValidEmail(email) === false) {
        message = messages.error.user.create.invalid_email;
    } else if (!password) {
        message = messages.error.user.create.missing_parameter.replace('%parameter%', 'password');
    } else if (isValidPassword(password) === false) {
        message = messages.error.user.create.invalid_password;
    } else if (!passwordConfirmation) {
        message = messages.error.user.create.missing_parameter.replace('%parameter%', 'passwordConfirmation');
    } else if (password !== passwordConfirmation) {
        message = messages.error.user.create.password_confirmation;
    } else {
        database.findBy('user', {'username': username}, 1).then((usernames) => {
            if (usernames.length > 0) {
                response.status(status.ko.badrequest).json({'message': messages.error.user.create.username_exists});
            } else {
                database.findBy('user', {'email': email}).then((emails) => {
                    if (emails.length > 0) {
                        response.status(status.ko.badrequest).json({'message': messages.error.user.create.email_exists});
                    } else {
                        database.insert('user', {
                            'username': username,
                            'firstname': firstname,
                            'lastname': lastname,
                            'email': email,
                            'password': hasher.generate(password)
                        }).then((users) => {
                            if (users.affectedRows === 0) {
                                response.status(status.ko.server).json({'message': messages.error.fallback});
                            } else {
                                response.status(status.ok).json({'message': messages.success.user.create});
                            }
                        });
                    }
                });
            }
        });
        return;
    }
    response.status(status.ko.badrequest).json({'message': message});
}

function get(request, response) {
    const user = request.user,
        {id} = request.params;

    if (user.id !== id && !user.is_administrator) {
        response.status(status.ko.unauthorized).json({'message': messages.error.user.get.unauthorized});
        return;
    }
    database.findBy('user', {'id': id}, 1).then((results) => {
        if (results.length !== 1) {
            response.status(status.ko.badrequest).json({'message': messages.error.user.get.not_found});
            return;
        }
        response.status(status.ok).json({
            'message': messages.success.user,
            'data': results[0]
        });
    });
}

function update(request, response) {
    const user = request.user,
        {id} = request.params,
        {field, value} = request.body,
        fields = ['id', 'is_administrator', 'created_at', 'password'],
        data = [];
    let message = null;

    if (!field || !value) {
        message = messages.error.user.update.missing_parameter.replace('%parameter%', !field ? 'field' : 'value');
        response.status(status.ko.badrequest).json({'message': message});
        return;
    }
    if (fields.includes(field)) {
        message = messages.error.user.update.bad_parameter.replace('%field%', field);
        response.status(status.ko.badrequest).json({'message': message});
        return;
    }
    data[field] = value;
    if (user.id !== id && !user.is_administrator) {
        response.status(status.ko.unauthorized).json({'message': messages.error.user.update.not_administrator});
        return;
    }
    database.update('user', data, {'id': id});
    response.status(status.ok).json({'message': messages.success.user.update});
}

function remove(request, response) {
    const user = request.user,
        {id} = request.params;

    if (user.id !== id && !user.is_administrator) {
        response.status(status.ko.unauthorized).json({'message': messages.error.user.remove.unauthorized});
        return;
    }
    database.remove('user', {'id': id});
    response.status(status.ok).json({'message': messages.success.user.remove});
}

module.exports = {
    'create': create,
    'get': get,
    'update': update,
    'remove': remove
};
