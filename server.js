const { app } = require('./app.js');
require('dotenv').config();
const { dbConnect } = require('./src/database/dbConnection.js');

dbConnect().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
  });
});
