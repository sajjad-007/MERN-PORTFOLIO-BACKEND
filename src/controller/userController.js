const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const cloudinary = require('cloudinary');
const { userModel } = require('../models/userSchema');
const { generateToken } = require('../utilits/jwtToken');
const { sendEmail } = require('../utilits/sendEmail');
const crypto = require('crypto');
//REGISTER CONTROLLER
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

//LOGIN CONTROLLER
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

//LOG OUT CONTROLLER
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

//GET USER CONTROLLER
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

//UPDATE PROFILE CONTROLLER
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
      new: true, //returns the updated document instead of the old one
      runValidators: true, //enforces schema rules
      useFindAndModify: false, //uses the modern update method.
    }
  );
  res.status(200).json({
    success: true,
    message: 'Profile update successfull',
    updateProfile,
  });
});

//GET USER FOR PORTFOLIO
const getUserforPortfolio = catchAsyncErrors(async (req, res, next) => {
  const id = '689499b66e3e3657c71cee48';
  const findUser = await userModel.findById(id);
  if (!findUser) {
    return next(new ErrorHandler('User not found!', 401));
  }
  res.status(201).json({
    success: true,
    message: 'User found successfully!',
    findUser,
  });
});

//UPDATE PASSWORD
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await userModel.findById(req.user._id).select('+password');
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler('Credentials Missing!', 401));
  }
  //match password
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Current Password doesn't Match!", 401));
  }
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New Password & Confirm Password doesn't Match!", 401)
    );
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res.status(201).json({
    success: true,
    message: 'Password Upadted!',
  });
});
//FORGOT PASSWORD
const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler('Email is not found!', 401));
  }
  const findUser = await userModel.findOne({ email: email });
  if (!findUser) {
    return next(new ErrorHandler('User is not found!', 401));
  }
  const resetToken = findUser.generateResetToken();
  await findUser.save({ validateBeforeSave: false }); //Save token to DB after generating

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your Reset Password token is below: \n\n ${resetPasswordUrl} \n\n If you've not requested for this email, please ignore it.`;
  try {
    sendEmail({
      email: findUser.email,
      subject: 'Personal Dashboard Password Reset',
      message,
    });
    res.status(201).json({
      success: true,
      message: `Email sent to ${findUser.email} successfull!`,
    });
  } catch (error) {
    (findUser.resetPasswordToken = undefined),
      (findUser.resetPasswordExpire = undefined),
      await findUser.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
//RESET PASSWORD
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  //find user in database using token
  const user = await userModel.findOne({
    resetPasswordToken,
    //The $gt is a MongoDB query operator that means “greater than”.
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler('Reset Password token is Invalid or Expried', 401)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passowrd doesn't Match", 401));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(user, 200, res, 'Password reset successfull!');
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  updateProfile,
  getUserforPortfolio,
  updatePassword,
  forgetPassword,
  resetPassword,
};
