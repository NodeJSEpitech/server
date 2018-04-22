const router = require('express').Router(), // eslint-disable-line new-cap
    controller = require('../controller/security');

router.post('/authenticate', controller.authenticate);

module.exports = router;
