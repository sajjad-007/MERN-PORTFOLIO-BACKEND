const { catchAsyncErrors } = require('../middlewares/catchAsyncErrors');
const { ErrorHandler } = require('../middlewares/error');
const { projectModel } = require('../models/projectSchema');
const cloudinary = require('cloudinary');

//CREATE PROJECT
const createProject = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Image field is empty', 404));
  }
  if (!req.files.projectImage) {
    return next(new ErrorHandler('Project Image not found', 404));
  }
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
  } = req.body;
  if (
    !title ||
    !description ||
    !gitRepoLink ||
    !projectLink ||
    !stack ||
    !technologies ||
    !deployed
  ) {
    return next(new ErrorHandler('Credentials Missing!', 401));
  }
  const { projectImage } = req.files;
  const cloudinaryResponseForProjectImage = await cloudinary.uploader.upload(
    projectImage.tempFilePath,
    {
      folder: 'PROJECT_IMAGE',
    }
  );
  if (
    !cloudinaryResponseForProjectImage ||
    cloudinaryResponseForProjectImage.error
  ) {
    console.error(
      'Cloudinary error',
      cloudinaryResponseForProjectImage.error || 'Unknown cloudinary error!'
    );
    return next(new ErrorHandler('Error from cloudinary image upload', 500));
  }
  const saveProjectDb = await projectModel.create({
    title,
    description,
    gitRepoLink,
    projectLink,
    stack,
    technologies,
    deployed,
    projectImage: {
      public_id: cloudinaryResponseForProjectImage.public_id,
      url: cloudinaryResponseForProjectImage.secure_url,
    },
  });
  if (!saveProjectDb) {
    return next(new ErrorHandler("Database Couldn't save!", 401));
  }
  res.status(200).json({
    success: true,
    message: 'Project Model created successfully!',
    saveProjectDb,
  });
});
//GET ALL PROJECT
const getAllProject = catchAsyncErrors(async (req, res, next) => {
  const searchAllProject = await projectModel.find({});
  if (!searchAllProject) {
    return next(new ErrorHandler('Database is Empty', 404));
  }
  res.status(200).json({
    success: true,
    message: 'All Project Found!',
    searchAllProject,
  });
});
// GET SINGLE PROJECT
const getSingleProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const findProject = await projectModel.findById(id);
  if (!findProject) {
    return next(new ErrorHandler('Project Not found!', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Project found succesfull!',
    findProject,
  });
});
//DELETE PROJECT
const deleteProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const findProject = await projectModel.findById(id);
  if (!findProject) {
    return next(new ErrorHandler('Project Not found!', 404));
  }
  const projectImgId = findProject.projectImage.public_id;
  await cloudinary.uploader.destroy(projectImgId);
  //now the delete database
  await findProject.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Project Delete succesfull!',
  });
});
//UPDATE PROJECT'S INFORMATION
const updateProject = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updateProjectData = {
    title: req.body.title,
    description: req.body.description,
    gitRepoLink: req.body.gitRepoLink,
    projectLink: req.body.projectLink,
    stack: req.body.stack,
    technologies: req.body.technologies,
    deployed: req.body.deployed,
  };
  if (!req.files.projectImage) {
    return next(new ErrorHandler('Project Image not found', 404));
  }
  if (req.files && req.files.projectImage) {
    const newProjectImg = req.files.projectImage;
    const findMyProject = await projectModel.findById(id);
    const oldProjectImgId = findMyProject.projectImage.public_id;

    //destroy old image from cloudinary
    await cloudinary.uploader.destroy(oldProjectImgId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      newProjectImg.tempFilePath,
      {
        folder: 'UPDATED PROJECT IMG',
      }
    );
    updateProjectData.projectImage = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  //save database
  const updateDatabase = await projectModel.findByIdAndUpdate(
    id,
    updateProjectData,
    {
      new: true,
      // runValidators: true,
      useFindAndModify: false,
    }
  );
  if (!updateDatabase) {
    return next(new ErrorHandler("Couldn't update database", 401));
  }
  res.status(200).json({
    success: true,
    message: 'Project Update succesfull!',
    updateDatabase,
  });
});

module.exports = {
  createProject,
  getAllProject,
  getSingleProject,
  deleteProject,
  updateProject,
};
