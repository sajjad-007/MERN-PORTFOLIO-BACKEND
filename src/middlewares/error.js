//The ErrorHandler class extends JavaScript's built-in Error class, adding a statusCode for HTTP errors.
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // This(super) calls the parent Error class constructor
    this.statusCode = statusCode;
  }
}

// This errorMiddleware function handles errors across your Express application, formatting them to send consistent responses.

// 1. Default Error Values:
// If no specific error message or status code is provided, it defaults to "Internal server error" and code 500.
const errorMiddleware = (err, res, req, next) => {
  err.message = err.message || 'Internal server error';
  err.statusCode = err.statusCode || 500;
  
  console.log(err.message)
  // 2. Specific Error Conditions:
  // MongoDB duplicate key error (code 11000, not statusCode)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  // JWT Invalid Token Error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json web token is Invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }
  // JWT Expired Token Error
  if (err.name === 'TokenExpiredError') {
    const message = `Json web token is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }
  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //3. Formatting Error Message:
  //If the error contains nested errors (common in validation errors), it compiles them into a single string.
  //If not, it uses the main error message.
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map(error => error.message)
        .join(' ')
    : err.message;

  //4. Sending the Response:
  //  Sends a JSON response with the status code and the compiled error message.
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

module.exports = { ErrorHandler, errorMiddleware };
