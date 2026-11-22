const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const { __v, passwordHash, ...rest } = this.toObject();
  return rest;
};

module.exports = mongoose.model('User', userSchema);
