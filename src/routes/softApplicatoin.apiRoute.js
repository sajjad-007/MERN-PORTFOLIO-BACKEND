const express = require('express');
const {
  createSoftwareApplication,
  deleteSoftwareApplication,
  getAllSoftwareApplication,
} = require('../controller/softwareApplication');
const _ = express.Router();

_.route('/softApplication/create').post(createSoftwareApplication);
_.route('/softApplication/delete/:id').delete(deleteSoftwareApplication);
_.route('/softApplication/get').get(getAllSoftwareApplication);

module.exports = _;
