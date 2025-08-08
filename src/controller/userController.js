const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const cloudinary = require('cloudinary');
const { userModel } = require('../models/userSchema');
const { generateToken } = require('../utilits/jwtToken');

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
    avatar.tempFilePath, // in app.js flieUpload() middleware, tempFilePath
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
  //create a user
  const registerUser = await userModel.create({
    fullName,
    email,
    phoneNumber,
    password,
    portfolioUrl,
    aboutMe,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id, // Set your cloudinary public_id here
      url: cloudinaryResponseForAvatar.secure_url, // Set your cloudinary secure_url here
    },
    resume: {
      public_id: cloudinaryResponseForResume.public_id, // Set your cloudinary public_id here
      url: cloudinaryResponseForResume.secure_url, // Set your cloudinary secure_url here
    },
  });
  if (!registerUser) {
    return next(new ErrorHandler('user registration unsuccessfull', 401));
  }
  res.status(200).json({
    success: true,
    message: 'registration successfull',
    registerUser,
  });
  generateToken(registerUser, 201, res, 'registration successfull');
});

//login controller
const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Credentials Missing!', 401));
  }
  //search for user
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalied Email or Password', 401));
  }
  //check password is correct using brycpt
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler('Invalied Email or Password', 401));
  }
  //jwt token generate
  generateToken(user, 201, res, 'Login successfull');
});

//log out controller
const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: 'Logout successfull',
    });
});

//get user
const getUser = catchAsyncErrors(async (req, res, next) => {
  const findUser = await userModel.findById(req.user._id);
  if (!findUser) {
    return next(new ErrorHandler('User not found!', 401));
  }
  res.status(201).json({
    success: true,
    message: 'user found successfull',
    findUser,
  });
});

//update profile
const updateProfile = catchAsyncErrors(async (req, res, next) => {
  //update your information
  const newUpdatedProfile = {
    fullName: req.body.fullName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    portfolioUrl: req.body.portfolioUrl,
    aboutMe: req.body.aboutMe,
  };
  //update your avatar
  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await userModel.findById(req.user._id);
    const avatarImgId = user.avatar.public_id;
    if (avatarImgId) {
      await cloudinary.uploader.destroy(avatarImgId);
    }
    //uplaod new avatar
    const cloudinaryResNewAvatar = await cloudinary.uploader.upload(
      avatar.tempFilePath, // in app.js flieUpload() middleware, tempFilePath
      { folder: 'Avatar' }
    );
    newUpdatedProfile.avatar = {
      public_id: cloudinaryResNewAvatar.public_id,
      url: cloudinaryResNewAvatar.secure_url,
    };
  }
  //update your resume
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await userModel.findById(req.user._id);
    const resumeImgId = user.resume.public_id;
    if (resumeImgId) {
      await cloudinary.uploader.destroy(resumeImgId);
    }
    const cloudinaryResNewResume = await cloudinary.uploader.upload(
      resume.tempFilePath,
      {
        folder: 'My_Resume',
      }
    );
    newUpdatedProfile.resume = {
      public_id: cloudinaryResNewResume.public_id,
      url: cloudinaryResNewResume.secure_url,
    };
  }
  const updateProfile = await userModel.findByIdAndUpdate(
    req.user._id,
    newUpdatedProfile,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );
  res.status(200).json({
    success: true,
    message: 'Profile update successfull',
    updateProfile,
  });
});

module.exports = { register, login, logout, getUser, updateProfile };
