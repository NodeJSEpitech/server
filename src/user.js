function get(request, response) {
    /// TODO : get information of user
    response.json({
        "success": true,
        "username": "Prof",
        "email": "olivier.drouin@epitech.eu"
    });
}

function create(request, response) {
    const username = request.query.username,
        password = request.query.password,
        passwordConfirmation = request.query.passwordConfirmation,
        email = request.query.email;
    /// TODO : create new user
    response.json({
        "success": true,
        "message": "User newly created"
    });
}

module.exports = {
    "get": get,
    "create": create
};
