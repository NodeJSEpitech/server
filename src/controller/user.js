const database = require('./database.js'),
    regexps = {
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/
    };


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
        confirmPassword
    } = request.body;
    let success = false,
        message = '';

    if (!username || !firstname || !lastname || !email || !password || !confirmPassword) {
        message = 'Some fields are missing';
    } else if (isValidEmail(email) === false) {
        message = 'Invalid email';
    } else if (isValidPassword(password) === false) {
        message = 'Invalid password';
    } else if (password !== confirmPassword) {
        message = 'Please re-confirm your password';
    } else {
        database.insert('user', {
            'firstname': firstname,
            'lastname': lastname,
            'email': email,
            'password': password
        });
    }
    response.json({
        'success': true,
        'message': 'User newly created'
    });
}

function get(request, response) {

}

module.exports = {
    'create': create,
    'get': get
};
