const session = require('express-session'),
    database = require('./database.js');

function create(request, response) {
    const {firstname, lastname, email, password, confirmPassword} = request.query;
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
        response.json({
            'success': true,
            'message': 'Some fields are missing'
        });
        return;
    }
    database.insert('user', {
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'password': password
    });
    response.json({
        'success': true,
        'message': 'User newly created'
    });
}

module.exports = {
    'create': create
};
