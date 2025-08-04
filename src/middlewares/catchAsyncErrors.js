export const catchAsyncErrors = theErroCatcherFun => {
  return (req, res, next) => {
    Promise.resolve(theErroCatcherFun(req, res, next)).catch();
  };
};
