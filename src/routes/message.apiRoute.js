const express = require('express');
const _ = express.Router();

const {
  sendMessage,
  getAllMessage,
  deleteMessage,
} = require('../controller/messageController');

_.route('/send').post(sendMessage).get(getAllMessage);
_.route('/send/:id').delete(deleteMessage);

module.exports = _;
