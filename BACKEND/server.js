const { app } = require('./app.js');
require('dotenv').config();
const { dbConnect } = require('./src/database/dbConnection.js');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on port`, process.env.PORT);
  });
});
