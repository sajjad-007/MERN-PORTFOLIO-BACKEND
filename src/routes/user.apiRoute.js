const express = require('express');
const _ = express.Router();

const {
  register,
  login,
  logout,
  getUser,
  updateProfile,
} = require('../controller/userController');
const { isUserAuthenticated } = require('../middlewares/auth');

_.route('/register').post(register);
_.route('/login').post(login);
_.route('/logout').post(isUserAuthenticated, logout);
_.route('/getuser').get(isUserAuthenticated, getUser);
_.route('/updateProfile').put(isUserAuthenticated, updateProfile);

module.exports = _;
