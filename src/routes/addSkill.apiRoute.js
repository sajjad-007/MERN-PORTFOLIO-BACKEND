const express = require('express');
const {
  createAddSkill,
  deleteSkill,
  getAllSkill,
  updateSkill,
} = require('../controller/addSkillController');
const { isUserAuthenticated } = require('../middlewares/auth');
const _ = express.Router();

_.route('/create').post(isUserAuthenticated, createAddSkill);
_.route('/delete/:id').delete(isUserAuthenticated, deleteSkill);
_.route('/getall').get(getAllSkill);
_.route('/update').put(isUserAuthenticated, updateSkill);

module.exports = _;
