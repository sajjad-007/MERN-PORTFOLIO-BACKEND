const express = require('express');

const { isUserAuthenticated } = require('../middlewares/auth');
const { createProject, getAllProject, getSingleProject } = require('../controller/projectController');
const _ = express.Router();

_.route('/create').post(isUserAuthenticated, createProject);
// _.route('/delete/:id').delete(isUserAuthenticated, deleteSoftwareApplication);
_.route('/getall').get(getAllProject);
_.route('/get/:id').get(getSingleProject);

module.exports = _;
