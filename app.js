const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ['GET', 'PUT', 'DELETE', 'POST'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//TO USE INPUT PROPERTY "FILES", IF WE USE fileUpload WE DON'T HAVE TO USE "MULTER" 
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/temp/' }));

module.exports = { app };
