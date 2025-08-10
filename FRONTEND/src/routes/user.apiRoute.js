const express = require('express');
const _ = express.Router();

const {
  register,
  login,
  logout,
  getUser,
  updateProfile,
  getUserforPortfolio,
  updatePassword,
  forgetPassword,
  resetPassword,
} = require('../controller/userController');
const { isUserAuthenticated } = require('../middlewares/auth');

_.route('/register').post(register);
_.route('/login').post(login);
_.route('/logout').post(isUserAuthenticated, logout);
_.route('/getuser').get(isUserAuthenticated, getUser);
_.route('/updateProfile').put(isUserAuthenticated, updateProfile);
_.route('/getuser/portfolio').get(getUserforPortfolio);
_.route('/password/update').put(isUserAuthenticated, updatePassword);
_.route('/password/forget').post(forgetPassword);
_.route('/password/reset/:token').post(resetPassword);

module.exports = _;
