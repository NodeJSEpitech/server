const router = require('express').Router(), // eslint-disable-line new-cap
    parser = require('body-parser'),
    security = require('../middleware/security'),
    middleware = require('../middleware/base'),
    {status, messages} = require('../../config/variables');

router.use(parser.json());
router.use(middleware.headering);

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
