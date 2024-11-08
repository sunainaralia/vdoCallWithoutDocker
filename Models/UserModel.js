const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 5
  },
  role: {
    type: String,
    required: true
  },
  profile_img: {
    type: String
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
// hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 12)
  next();
});
// method to compare the password
userSchema.methods.comparePasswordInDb = async function (pass, passInDb) {
  return await bcryptjs.compare(pass, passInDb);

}
const User = mongoose.model('User', userSchema);
module.exports = User;
