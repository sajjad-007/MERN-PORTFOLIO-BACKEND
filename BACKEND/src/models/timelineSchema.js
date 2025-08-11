const mongoose = require('mongoose');
const { Schema } = mongoose;

const timelineSchema = new Schema(
  {
    title: {
      type: String,
      required: ['Title is required!'],
    },
    description: {
      type: String,
      required: ['Description is required!'],
    },
    timeline: {
      from: {
        type: String,
        required: ['From field is required!'],
      },
      to: String,
    },
  },
  { timestamps: true }
);

const timelineModel = mongoose.model('timeline', timelineSchema);

module.exports = { timelineModel };
