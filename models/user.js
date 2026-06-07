import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'farmer'],
    default: 'user'
  },
  depositsBalance: {
    type: Number,
    default: 0
  },
  winningsBalance: {
    type: Number,
    default: 0
  },
  bonusBalance: {
    type: Number,
    default: 10
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
