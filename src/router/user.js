const router = require('express').Router(), // eslint-disable-line new-cap
    security = require('../middleware/security'),
    controller = require('../controller/user');

router.post('/user', controller.create);

router.get('/user/:id', security.check, controller.get);
router.patch('/user/:id', security.check, controller.update);
router.delete('/user/:id', security.check, controller.remove);

module.exports = router;
