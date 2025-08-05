const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../middlewares/error');
const { messageModel } = require('../models/messageSchema');

const sendMessage = catchAsyncErrors(async (req, res, next) => {
  try {
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
  } catch (error) {
    console.error('error from send message', error);
  }
});

// get all message
const getAllMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const myMessages = await messageModel.find({});
    if (!myMessages) {
      return next(new ErrorHandler("Message couldn't found!", 400));
    }
    res.status(201).json({
      success: true,
      message: 'Found all message',
      myMessages,
    });
  } catch (error) {
    console.error('error from getAllMessage', error);
  }
});

//delete
const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    //now delete a message from database
    const deleteMsg = await messageModel.findByIdAndDelete({ _id: id });
    // console.log(deleteMsg);
    res.status(201).json({
      success: true,
      message: 'message delete successfull',
      deleteMsg,
    });
  } catch (error) {
    console.error('error from getAllMessage', error);
  }
});

module.exports = { sendMessage, getAllMessage, deleteMessage };
