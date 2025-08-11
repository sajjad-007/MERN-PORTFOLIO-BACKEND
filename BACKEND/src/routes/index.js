const express = require('express');
const _ = express.Router();

const messageRoute = require('./message.apiRoute');
const timeline = require('./timeline.apiRoute');
const userRotue = require('./user.apiRoute');
const softwareApplication = require('./softApplicatoin.apiRoute');
const addSkill = require('./addSkill.apiRoute');
const project = require('./project.apiRoute');

//.use() হল Express.js-এর একটি middleware ফাংশন,যা অন্য কোনো router যুক্ত করতে ব্যবহৃত হয়
_.use('/api/v1/user', userRotue);
_.use('/api/v1', messageRoute);
_.use('/api/v1', timeline);
_.use('/api/v1/softApplication', softwareApplication);
_.use('/api/v1/addSkill', addSkill);
_.use('/api/v1/project', project);

module.exports = _;
