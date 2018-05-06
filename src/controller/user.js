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
            'passwordConfirmation': joi.string().required(),
            'avatar': joi.string().optional()
        },
        validation = joi.validate(request.body, schema),
        values = validation.value;

    if (validation.error || values.password !== values.passwordConfirmation) {
        response.status(status.ko.badrequest).json({'message': messages.error.user.create.bad_parameter});
        return false;
    }
    database.findBy('user', `username='${values.username}' OR email='${values.email}'`, 1).then((duplications) => {
        if (duplications.length !== 0) {
            response.status(status.ko.badrequest).json({'message': messages.error.user.create.account_exists});
            return false;
        }
        database.insert('user', {
            'username': values.username,
            'firstname': values.firstname,
            'lastname': values.lastname,
            'email': values.email,
            'password': hasher.generate(values.password),
            'avatar': values.avatar
        }).then((users) => {
            if (users.affectedRows !== 1) {
                response.status(status.ko.server).json({'message': messages.error.fallback});
                return false;
            }
            response.status(status.ok).json({
                'message': messages.success.user.create,
                'data': {'id': users.insertId}
            });
            return true;
        });
        return false;
    });
    return false;
}

function get(request, response) {
    const id = request.params.id ? parseInt(request.params.id, 10) : null;
    let user = null;

    if (request.user.id !== id && !request.user.is_administrator) {
        response.status(status.ko.unauthorized).json({'message': messages.error.user.get.unauthorized});
        return false;
    }
    database.findBy('user', {'id': id}, 1).then((users) => {
        if (users.length !== 1) {
            response.status(status.ko.badrequest).json({'message': messages.error.user.get.not_found});
            return false;
        }
        user = Object.assign({}, users[0], {'password': 'hidden'});
        response.status(status.ok).json({
            'message': messages.success.user.get,
            'data': user
        });
        return true;
    });
    return false;
}

function update(request, response) {
    const id = request.params.id ? parseInt(request.params.id, 10) : null,
        user = request.user,
        schema = {
            'field': joi.string().required(),
            'value': joi.required()
        },
        validation = joi.validate(request.body, schema),
        fields = ['id', 'email', 'is_administrator', 'created_at', 'password'],
        {field, value} = validation.value,
        data = {};

    if (validation.error || fields.includes(field)) {
        response.status(status.ko.badrequest).json({'message': messages.error.user.update.bad_parameter});
        return false;
    }
    if (user.id !== id && !user.is_administrator) {
        response.status(status.ko.unauthorized).json({'message': messages.error.user.update.not_administrator});
        return false;
    }
    data[field] = value;
    database.update('user', data, {'id': id}).then((users) => {
        if (users.affectedRows !== 1) {
            response.status(status.ko.server).json({'message': messages.error.user.update.bad_parameter});
            return false;
        }
        response.status(status.ok).json({'message': messages.success.user.update});
        return true;
    });
    return false;
}

function remove(request, response) {
    const id = request.params.id ? parseInt(request.params.id, 10) : null,
        user = request.user;

    if (user.id !== id && !user.is_administrator) {
        response.status(status.ko.unauthorized).json({'message': messages.error.user.remove.not_administrator});
        return false;
    }
    database.remove('user', {'id': id}).then((users) => {
        if (users.affectedRows === 0) {
            response.status(status.ko.server).json({'message': messages.error.user.remove.bad_parameter});
            return false;
        }
        response.status(status.ok).json({'message': messages.success.user.remove});
        return true;
    });
    return false;
}

module.exports = {
    'create': create,
    'get': get,
    'update': update,
    'remove': remove
};
