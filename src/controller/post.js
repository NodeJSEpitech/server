const joi = require('joi'),
    mysql = require('mysql'),
    database = require('../service/database'),
    {status, messages} = require('../../config/variables');

function create(request, response) {
    const schema = {
            'title': joi.string().min(8).max(32).required(),
            'description': joi.string().min(8).max(128).optional(),
            'content': joi.string().required()
        },
        validation = joi.validate(request.body, schema),
        values = validation.value;

    if (validation.error) {
        response.status(status.ko.badrequest).json({'message': messages.error.post.create.bad_parameter});
        return false;
    }
    database.insert('post', {
        'creator_id': request.user.id,
        'title': values.title,
        'description': values.description ? values.description : null,
        'content': values.content
    }).then((posts) => {
        if (posts.affectedRows !== 1) {
            response.status(status.ko.server).json({'message': messages.error.fallback});
            return false;
        }
        response.status(status.ok).json({
            'message': messages.success.post.create,
            'data': {'id': posts.insertId}
        });
        return true;
    }).catch(() => {
        response.status(status.ko).json({
            'message': messages.error.fallback,
        });
        return false;
    });
    return false;
}

function get(request, response) {
    const id = request.params.id ? parseInt(request.params.id, 10) : null,
        post = database.getFinalTable('post'),
        comment = database.getFinalTable('comment'),
        where = id !== null ? `p.id = ${mysql.escape(id)}` : null,
        finalWhere = where === null ? 'p.deleted_at IS NULL' : `p.deleted_at IS NULL AND ${where}`,
        limit = id !== null ? `LIMIT 1` : '',
        orderBy = id !== null ? '' : `ORDER BY p.created_at DESC`,
        sql = `SELECT p.*, COUNT(c.id) AS comments FROM ${post} AS p
                LEFT JOIN ${comment} AS c ON c.post_id = p.id
                WHERE ${finalWhere} GROUP BY p.id ${orderBy} ${limit}`;

    database.query(sql).then((posts) => {
        if (id !== null && (posts.length !== 1 || (posts.length === 1 && posts[0].id === null))) {
            response.status(status.ko.badrequest).json({'message': messages.error.post.get.not_found});
            return false;
        }
        response.status(status.ok).json({
            'message': messages.success.post.get,
            'data': id !== null ? posts[0] : posts
        });
        return true;
    }).catch(() => {
        response.status(status.ko).json({
            'message': messages.error.fallback,
        });
        return false;
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
        fields = ['id', 'creator_id', 'created_at'],
        {field, value} = validation.value,
        where = {'id': id},
        data = {};

    if (validation.error || fields.includes(field)) {
        response.status(status.ko.badrequest).json({'message': messages.error.post.update.bad_parameter});
        return false;
    }
    if (!user.is_administrator) {
        where.creator_id = user.id; // eslint-disable-line camelcase
    }
    data[field] = value;
    database.update('post', data, where).then((posts) => {
        if (posts.affectedRows !== 1) {
            response.status(status.ko.badrequest).json({'message': messages.error.post.update.bad_parameter});
            return false;
        }
        response.status(status.ok).json({'message': messages.success.post.update});
        return true;
    }).catch(() => {
        response.status(status.ko).json({
            'message': messages.error.fallback,
        });
        return false;
    });
    return false;
}

function remove(request, response) {
    const id = request.params.id ? parseInt(request.params.id, 10) : null,
        user = request.user,
        where = {'id': id};

    if (!user.is_administrator) {
        where.creator_id = user.id; // eslint-disable-line camelcase
    }
    database.remove('post', where).then((posts) => {
        if (posts.affectedRows === 0) {
            response.status(status.ko.badrequest).json({'message': messages.error.post.remove.bad_parameter});
            return false;
        }
        response.status(status.ok).json({'message': messages.success.post.remove});
        return true;
    }).catch(() => {
        response.status(status.ko).json({
            'message': messages.error.fallback,
        });
        return false;
    });
    return false;
}

module.exports = {
    'get': get,
    'create': create,
    'update': update,
    'remove': remove
};
