const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const { timelineModel } = require('../models/timelineSchema');

const createTimeline = catchAsyncErrors(async (req, res, next) => {
  const { title, description, from, to } = req.body;
  if (!title || !description || !from ) {
    return next(new ErrorHandler('Credential Missing!', 404));
  }
  //save database
  const createNewTimeline = await timelineModel.create({
    title,
    description,
    timeline: { from, to },
  });
  if (!createNewTimeline) {
    return next(new ErrorHandler('Database create unsuccessfull!', 401));
  }
  res.status(200).json({
    success: true,
    message: 'Timeline created!',
    createNewTimeline,
  });
});
const getAllTimeline = catchAsyncErrors(async (req, res, next) => {
  const getAllTimelineData = await timelineModel.find({});
  if (!getAllTimelineData) {
    return next(ErrorHandler('Database is empty', 401));
  }
  res.status(200).json({
    success: true,
    message: 'Time Line data found successfully',
    getAllTimelineData,
  });
});
const deleteTimeline = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const isTimelineExist = await timelineModel.findById(id);
  if (!isTimelineExist) {
    return next(new ErrorHandler("This message doesn't exist!", 401));
  }
  await isTimelineExist.deleteOne();
  res.status(200).json({
    success: true,
    message: 'A timeline delete successfull',
    isTimelineExist,
  });
});

module.exports = { createTimeline, deleteTimeline, getAllTimeline };
