const mongoose = require('mongoose');
const { Schema } = mongoose;

const softwareAppSchema = new Schema(
  {
    title: {
      type: String,
      required: ['Title is required!'],
    },
    icons: {
      public_id: {
        type: String,
        required: ['Public_id is required!'],
      },
      url: {
        type: String,
        required: ['url is required'],
      },
    },
  },
  { timestamps: true }
);

const softApplicationModel = mongoose.model(
  'softwareApplication',
  softwareAppSchema
);

module.exports = { softApplicationModel };
