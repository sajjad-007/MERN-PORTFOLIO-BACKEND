class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, res, req, next) => {
  err.message = err.message || 'Internal server error';
  err.statusCode = err.statusCode || 500;

  //if user already exist  throw this error
  if (err.statusCode === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  if ((err.name = 'JsonWebToken')) {
    const message = `Json web token is Invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }
  if ((err.name = 'TokenExpiredToken')) {
    const message = `Json web token is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }
  if ((err.name = 'CastError')) {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map(error => error.message)
        .join(' ')
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
