const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const cloudinary = require('cloudinary');
const { userModel } = require('../models/userSchema');

const register = catchAsyncErrors(async (req, res, next) => {
  //Object.keys(req.files).length === 0, means if req.files was empty
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Files are required!', 400));
  }
  
  // Check if required files exist
  if (!req.files.avatar) {
    return next(new ErrorHandler('Avatar file is required!', 400));
  }
  
  if (!req.files.resume) {
    return next(new ErrorHandler('Resume file is required!', 400));
  }
  
  const { avatar, resume } = req.files;
  //uplaod your avatar
  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: 'Avatar' }
  );
  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    console.error(
      'cloudinary error',
      cloudinaryResponseForAvatar.error || 'Unknown cloudinary error'
    );
    return next(new ErrorHandler('Avatar is not found', 401));
  }
  //uplaod your Resuem
  const cloudinaryResponseForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: 'My_Resume' }
  );
  if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
    console.error(
      'cloudinary error',
      cloudinaryResponseForResume.error || 'Unknown cloudinary error'
    );
    return next(new ErrorHandler('Resume is not found', 401));
  }
  // upload user info into database
  const { fullName, email, phoneNumber, password, portfolioUrl, aboutMe } =
    req.body;
  const registerUser = await userModel.create({
    fullName,
    email,
    phoneNumber,
    password,
    portfolioUrl,
    aboutMe,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id,
      url: cloudinaryResponseForAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResponseForResume.public_id,
      url: cloudinaryResponseForResume.secure_url,
    },
  });
  if(!registerUser){
    return next(new ErrorHandler("user registration unsuccessfull",401))
  }
  res.status(200).json({
    success: true,
    message: "registration successfull",
    registerUser,
  })
});

module.exports = { register };
