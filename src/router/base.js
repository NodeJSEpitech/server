const router = require('express').Router(), // eslint-disable-line new-cap
    parser = require('body-parser'),
    security = require('../middleware/security'),
    {status, messages} = require('../../config/variables');

router.use(parser.json());

router.use((req, res, next) => {
    res
        .set('access-control-allow-origin', '*')
        .set('access-control-allow-headers', 'Content-Type');
    next();
});

router.get('/', (request, response) => {
    response.status(status.ok).json({
        'message': messages.success.welcome.unauth
    });
});

router.get('/me', security.check, (request, response) => {
    response.status(status.ok).json({
        'message': messages.success.welcome.auth,
        'data': request.user
    });
});

module.exports = router;
