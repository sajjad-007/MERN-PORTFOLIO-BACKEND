const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderName: {
      type: String,
      min: [2, 'Name must contain at least 2 character'],
    },
    subject: {
      type: String,
      min: [2, 'Name must contain at least 2 character'],
    },
    message: {
      type: String,
      min: [2, 'Name must contain at least 2 character'],
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model('message', messageSchema);

module.exports = { messageModel };
