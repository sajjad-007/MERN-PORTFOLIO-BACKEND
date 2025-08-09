const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  title: String,
  description: String,
  gitRepoLink: String,
  projectLink: String,
  stack: String,
  technologies: String,
  deployed: String,
  projectImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: { type: String, required: true },
  },
});

const projectModel = mongoose.model('project', projectSchema);

module.exports = { projectModel };
