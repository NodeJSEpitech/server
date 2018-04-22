const router = require('express').Router(), // eslint-disable-line new-cap
    controller = require('../controller/user');

router.get('/user/:id(\d+)', controller.get);

router.post('/user', controller.create);

router.patch('/user/:id(\d+)', controller.update);

router.delete('/user/:id(\d+)', controller.remove);

module.exports = router;
