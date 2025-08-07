const express = require('express');
const _  = express.Router()

const { register } = require('../controller/userController');

_.route('/user').post(register);


module.exports = _