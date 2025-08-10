const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const allRoutes = require('./src/routes/index');
require('dotenv').config();
// cors middleware to connect frontend and backend
app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    // origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'PUT', 'DELETE', 'POST'],
    credentials: true,
  })
);
// for frontend login access cookie
app.use(cookieParser());
//to parse an json object and see its value

app.use(express.json());
//to parse nested (post method) values
app.use(express.urlencoded({ extended: true }));
//TO USE INPUT PROPERTY "FILES", IF WE USE fileUpload WE DON'T HAVE TO USE "MULTER"
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/',
  })
);
//My all routes
app.use(allRoutes);

module.exports = { app };
