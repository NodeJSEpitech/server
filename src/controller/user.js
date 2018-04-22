const database = require('../service/database.js'),
    hasher = require('password-hash'),
    joi = require('joi'),
    {status, messages, regexps} = require('../../config/variables');


function create(request, response) {
    const schema = {
            'username': joi.string().alphanum().min(4).max(30).required(),
            'firstname': joi.string().required(),
            'lastname': joi.string().required(),
            'email': joi.string().email().required(),
            'password': joi.string().regex(regexps.password).required(),
            'passwordConfirmation': joi.string().required()
        },
        validation = joi.validate(request.body, schema);

    if (validation.error || validation.value.password !== validation.value.passwordConfirmation) {
        return response.status(status.ko.badrequest).json({'message': messages.error.user.create.bad_parameter});
    }
    database.findBy('user', {'username': validation.value.username}, 1).then((usernames) => {
        if (usernames.length > 0) {
            return response.status(status.ko.badrequest).json({'message': messages.error.user.create.username_exists});
        }
        database.findBy('user', {'email': validation.value.email}).then((emails) => {
            if (emails.length > 0) {
                return response.status(status.ko.badrequest).json({'message': messages.error.user.create.email_exists});
            }
            database.insert('user', {
                'username': validation.value.username,
                'firstname': validation.value.firstname,
                'lastname': validation.value.lastname,
                'email': validation.value.email,
                'password': hasher.generate(validation.value.password)
            }).then((users) => {
                if (users.affectedRows === 0) {
                    return response.status(status.ko.server).json({'message': messages.error.fallback});
                }
                response.status(status.ok).json({'message': messages.success.user.create});
                return true;
            });
            return true;
        });
        return true;
    });
    return true;
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
