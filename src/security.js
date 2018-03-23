function check_authentication(request, response, next) {
    const token = request.query.token;
    if (token === undefined) {
        response.json({
            "success": false,
            "message": "No token provided"
        });
        return;
    }
    console.log("checking authentication...");
    /// TODO : check authentication
    next();
}

function authenticate(request, response) {
    const username = request.query.username,
        password = request.query.password;
    if (username === undefined || password === undefined) {
        response.json({
            "success": false,
            "message": "No username or password provided"
        });
        return;
    }
    console.log("authenticating...");
    /// TODO : authenticate
    response.json({
        "success": true,
        "token": "ThisIsASecretToken",
        "message": "You have been successfully authenticated"
    });
}

module.exports = {
    "check_authentication": check_authentication,
    "authenticate": authenticate
};
