const express = require('express');
const {
  createTimeline,
  deleteTimeline,
  getAllTimeline,
} = require('../controller/timelineController');
const _ = express.Router();

_.route('/timeline/create').post(createTimeline);
_.route('/timeline/delete/:id').delete(deleteTimeline);
_.route('/timeline/get').get(getAllTimeline);

module.exports = _;
