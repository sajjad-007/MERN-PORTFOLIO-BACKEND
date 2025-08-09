const express = require('express');
const {
  createTimeline,
  deleteTimeline,
  getAllTimeline,
} = require('../controller/timelineController');
const { isUserAuthenticated } = require('../middlewares/auth');
const _ = express.Router();

_.route('/timeline/create').post(isUserAuthenticated, createTimeline);
_.route('/timeline/delete/:id').delete(isUserAuthenticated, deleteTimeline);
_.route('/timeline/get').get(getAllTimeline);

module.exports = _;
