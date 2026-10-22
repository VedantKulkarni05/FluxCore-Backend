const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required for creating an account'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required for creating an account'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required for creating an account'],
      minlength: [8, 'Password must be at least 8 characters long'],
      maxlength: [72, 'Password must be at most 72 characters long'],
      select: false,
    }
    // role: {
    //   type: String,
    //   enum: ['user', 'admin'],
    //   default: 'user',
    // },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);