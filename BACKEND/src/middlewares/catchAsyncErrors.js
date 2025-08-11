//Purpose: This middleware wrapper eliminates the need to write repetitive try-catch blocks or .catch() handlers for every async controller function in your Express application.

// How it works:

// 1. Higher-Order Function: catchAsyncErrors takes a function (theFuntion) as a parameter and returns a new middleware function.
const catchAsyncErrors = theFuntion => {
  return (req, res, next) => {
    // 2. Promise Handling: It wraps the provided async function with Promise.resolve() and automatically catches any rejected promises.
    Promise.resolve(theFuntion(req, res, next)).catch(next);
    // 3. Express Middleware Pattern: Returns a standard Express middleware function with (req, res, next) parameters.
  };
};

module.exports = { catchAsyncErrors };
