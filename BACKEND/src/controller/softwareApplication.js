const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const { softApplicationModel } = require('../models/softwareApplication');
const cloudinary = require('cloudinary')

const createSoftwareApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Files are required!', 400));
  }
  // Check if required files exist
  if (!req.files.icons) {
    return next(new ErrorHandler('Icons file is required!', 400));
  }

  const { icons } = req.files;
  const { name } = req.body;
  
  if (!name) {
    return next(new ErrorHandler('Name is not found', 401));
  }
  //uplaod your avatar
  const cloudinaryResponseForIcons = await cloudinary.uploader.upload(
    icons.tempFilePath, // in app.js flieUpload() middleware, tempFilePath
    { folder: 'SOFTWARE-APPLICATIONS' }
  );
  if (!cloudinaryResponseForIcons || cloudinaryResponseForIcons.error) {
    console.error(
      'cloudinary error',
      cloudinaryResponseForIcons.error || 'Unknown cloudinary error'
    );
    return next(new ErrorHandler('ICON is not found', 401));
  }
  //now create database
  const uploadIcons = await softApplicationModel.create({
    name,
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
    message: 'Software Application created!',
    uploadIcons,
  });
});
const getAllSoftwareApplication = catchAsyncErrors(async (req, res, next) => {
  const findAllSoftAppData = await softApplicationModel.find({});
  if (!findAllSoftAppData) {
    return next(ErrorHandler('Already Deleted!', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Software Application found successfully',
    findAllSoftAppData,
  });
});
const deleteSoftwareApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const isSoftAppExist = await softApplicationModel.findById(id);
  if (!isSoftAppExist) {
    return next(new ErrorHandler("Softwate Application Not found!", 404));
  }
  const getSoftAppIconsId = isSoftAppExist.icons.public_id
  await cloudinary.uploader.destroy(getSoftAppIconsId)
  await isSoftAppExist.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Software Application deleted successfull!',
  });
});

module.exports = {
  createSoftwareApplication,
  deleteSoftwareApplication,
  getAllSoftwareApplication,
};
