const express = require('express');
const _ = express.Router();

const messageRoute = require('./message.apiRoute');

//.use() হল Express.js-এর একটি middleware ফাংশন,যা অন্য কোনো router যুক্ত করতে ব্যবহৃত হয়
_.use('/api/v1', messageRoute);


module.exports = _;