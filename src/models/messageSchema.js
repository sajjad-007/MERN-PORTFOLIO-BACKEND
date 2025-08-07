const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderName: {
      type: String,
      minLength: [2, 'Name must contain at least 2 characters'],
    },
    subject: {
      type: String,
      minLength: [2, 'subject must contain at least 2 characters'],
    },
    message: {
      type: String,
      minLength: [2, 'message must contain at least 2 characters'],
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model('message', messageSchema);

module.exports = { messageModel };
