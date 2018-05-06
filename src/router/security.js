const router = require('express').Router(), // eslint-disable-line new-cap
    security = require('../middleware/security'),
    controller = require('../controller/security');

router.post('/authenticate', controller.authenticate);
router.get('/logout', security.check, controller.logout);

module.exports = router;
