const mongoose = require('mongoose');
const { Schema } = mongoose;

const addSkillSchema = new Schema(
  {
    title: {
      type: String,
      required: ['Title is required!'],
    },
    proficiency: {
      type: String,
      required: ['Proficiency is required!'],
    },
    icons: {
      public_id: {
        type: String,
        required: ['Public_id required!'],
      },
      url: {
        type: String,
        required: ['Url required!'],
      },
    },
  },
  { timestamps: true }
);

const addSkillModel = mongoose.model('addSkill', addSkillSchema);

module.exports = { addSkillModel };
