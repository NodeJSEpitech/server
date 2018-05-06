const router = require('express').Router(), // eslint-disable-line new-cap
    security = require('../middleware/security'),
    controller = require('../controller/post');

router.get('/posts', controller.get);
router.get('/post/:id', controller.get);

router.post('/post', security.check, controller.create);
router.patch('/post/:id', security.check, controller.update);
router.delete('/post/:id', security.check, controller.remove);

module.exports = router;
