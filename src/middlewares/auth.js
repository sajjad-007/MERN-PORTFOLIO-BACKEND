const { userModel } = require('../models/userSchema');
const { catchAsyncErrors } = require('./catchAsyncErrors');
const { ErrorHandler } = require('./error');
const jwt = require('jsonwebtoken');

const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler('User is not authenticate',401));
  }
  //after verifying the JWT token, you get decoded.id (the user's ID stored in the token).
  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);
  //userModel.findById(decoded.id) to find that user in the database.
  req.user = await userModel.findById(decoded.id);
  //now req.user can access user's all data
  //Any middleware or route handler that runs later can directly use req.user to access the logged-in user’s information — without having to query the database again.
  // req.user = “The user who sent this request, already verified, with all their details.
  next();
});

module.exports = { isUserAuthenticated };
