const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Name required'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number required'],
  },
  aboutMe: {
    type: String,
    required: [true, 'About me section is reuired'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    // minLength: [8, 'Password must contain at least 8 characters'],
    //select false: so that passwords (even if hashed) aren’t accidentally exposed when fetching users.
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  portfolioUrl: {
    type: String,
    required: [true, 'Portfolio url is required'],
  },
  githubUrl: {
    type: String,
  },
  linkdinUrl: {
    type: String,
  },
  instragramUrl: {
    type: String,
  },
  facebookUrl: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//In Mongoose, isModified() is a method used on a document instance to check whether a particular path (field) has been modified since the document was loaded or saved.
userSchema.pre('save', async function(next) {
  // 1.if my password is not modified(not change) yet
  if (!this.isModified('password')) {
    return next(); // 2.move to the next step (e.g., saving the user)
  }
  //use bcrypt to hash my password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// userSchema.methods: now you can Add your own function to every user
//userSchema.methods will create a function name comparePassword in every user object (database) and it can compare user password
userSchema.methods.comparePassword = async function(newEnterdPassowrd) {
  return await bcrypt.compare(newEnterdPassowrd, this.password);
  // "Every user can now do user.comparePassword() to check if a password is correct."
};

userSchema.methods.generateJsonWebToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_TOKEN_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRESIN,
  });
};

const userModel = mongoose.model('user', userSchema);

module.exports = { userModel };
