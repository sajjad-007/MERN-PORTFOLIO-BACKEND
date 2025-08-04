const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const databaseConnection = mongoose.connect(process.env.DATABASE_URI);
    if (databaseConnection) {
      console.log('Database connection successfull');
    } else {
      console.error('Database connect failed!');
    }
  } catch (error) {
    console.error(`An error has occurred when connecting to database ${error}`);
  }
};

module.exports = {dbConnect}
