const router = require('express').Router();

const { checkToken, checkAdmin, checkProfe, checkAlum } = require('../utils/middlewares');

router.use('/users', require('./api/users'));


module.exports = router;