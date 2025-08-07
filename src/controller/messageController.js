const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const { messageModel } = require('../models/messageSchema');

const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { message, subject, senderName } = req.body;
  if (!message || !subject || !senderName) {
    return next(new ErrorHandler('Credential missing!', 400));
  }
  const sendMsgData = await messageModel.create({
    senderName: senderName,
    subject: subject,
    message: message,
  });
  res.status(201).json({
    success: true,
    message: 'Message Sent',
    sendMsgData,
  });
});

// get all message
const getAllMessage = catchAsyncErrors(async (req, res, next) => {
  const myMessages = await messageModel.find({});
  if (!myMessages) {
    return next(new ErrorHandler("Message couldn't found!", 400));
  }
  res.status(201).json({
    success: true,
    message: 'Found all message',
    myMessages,
  });
});

//delete
const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new ErrorHandler('id missing!', 400));
  }
  //now delete a message from database
  const deleteMsg = await messageModel.findByIdAndDelete({ _id: id });
  if (!deleteMsg) {
    return next(new ErrorHandler("Message couldn't deleted!", 400));
  }
  // console.log(deleteMsg);
  res.status(201).json({
    success: true,
    message: 'message delete successfull',
    deleteMsg,
  });
});

module.exports = { sendMessage, getAllMessage, deleteMessage };
