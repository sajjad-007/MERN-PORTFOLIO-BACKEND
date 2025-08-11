const express = require('express');

const { isUserAuthenticated } = require('../middlewares/auth');
const {
  createProject,
  getAllProject,
  getSingleProject,
  deleteProject,
  updateProject,
} = require('../controller/projectController');
const _ = express.Router();

_.route('/create').post(isUserAuthenticated, createProject);
_.route('/delete/:id').delete(isUserAuthenticated, deleteProject);
_.route('/getall').get(getAllProject);
_.route('/get/:id').get(getSingleProject);
_.route('/update/:id').put(updateProject);

module.exports = _;
