const express = require('express');
const {
  createSoftwareApplication,
  deleteSoftwareApplication,
  getAllSoftwareApplication,
} = require('../controller/softwareApplication');
const { isUserAuthenticated } = require('../middlewares/auth');
const _ = express.Router();

_.route('/create').post(isUserAuthenticated, createSoftwareApplication);
_.route('/delete/:id').delete(isUserAuthenticated, deleteSoftwareApplication);
_.route('/get').get(getAllSoftwareApplication);

module.exports = _;
