const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const { addSkillModel } = require('../models/addSkillSchema');
const cloudinary = require('cloudinary');

const createAddSkill = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Files are required!', 404));
  }
  // Check if required files exist
  if (!req.files.icons) {
    return next(new ErrorHandler('Icons file is required!', 404));
  }

  const { icons } = req.files;
  const { title, proficiency } = req.body;

  if (!title || !proficiency) {
    return next(new ErrorHandler('Credentials Missing!', 404));
  }
  //uplaod your avatar
  const cloudinaryResponseForIcons = await cloudinary.uploader.upload(
    icons.tempFilePath, // in app.js flieUpload() middleware, tempFilePath
    { folder: 'ADD-SKILL' }
  );
  if (!cloudinaryResponseForIcons || cloudinaryResponseForIcons.error) {
    console.error(
      'cloudinary error',
      cloudinaryResponseForIcons.error || 'Unknown cloudinary error'
    );
    return next(new ErrorHandler('ICON is not found', 401));
  }
  //now create database
  const uploadIcons = await addSkillModel.create({
    title,
    proficiency,
    icons: {
      public_id: cloudinaryResponseForIcons.public_id,
      url: cloudinaryResponseForIcons.secure_url,
    },
  });
  if (!uploadIcons) {
    return next(new ErrorHandler('Database create unsuccessfull', 401));
  }
  res.status(200).json({
    success: true,
    message: 'A Skill Added created!',
    uploadIcons,
  });
});
const getAllSkill = catchAsyncErrors(async (req, res, next) => {
  const allSkill = await addSkillModel.find({});
  if (!allSkill) {
    return next(ErrorHandler('Database is empty', 401));
  }
  res.status(200).json({
    success: true,
    message: 'All skill found successfully',
    allSkill,
  });
});
const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const isSkillExist = await addSkillModel.findById(id);
  if (!isSkillExist) {
    return next(new ErrorHandler('Skill Not Found', 404));
  }
  const addSkillId = isSkillExist.icons.public_id;
  await cloudinary.uploader.destroy(addSkillId);
  await isSkillExist.deleteOne();
  res.status(200).json({
    success: true,
    message: 'A Skill Deleted!',
  });
});
const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const findSkill = await addSkillModel.findById(id);
  if (!findSkill) {
    return next(new ErrorHandler('Skill not found!', 404));
  }
  const { proficiency } = req.body;
  const updateSkill = await addSkillModel.findByIdAndUpdate(
    id,
    {
      proficiency,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    message: 'Update successfull!',
    updateSkill,
  });
});

module.exports = { createAddSkill, deleteSkill, getAllSkill, updateSkill };
