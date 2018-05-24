function headering(request, response, next) {
    response
        .set('access-control-allow-origin', '*')
        .set('access-control-allow-headers', 'Content-Type,X-Authentication-Token');
    next();
}

module.exports = {
    'headering': headering
};
