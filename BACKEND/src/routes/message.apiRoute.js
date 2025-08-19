const express = require('express');
const _ = express.Router();

const {
  sendMessage,
  getAllMessage,
  deleteMessage,
} = require('../controller/messageController');
const { isUserAuthenticated } = require('../middlewares/auth');

_.route('/getall').post(sendMessage).get(getAllMessage);
_.route('/delete/:id').delete(isUserAuthenticated, deleteMessage);

module.exports = _;
