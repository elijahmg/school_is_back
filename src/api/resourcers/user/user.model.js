import mongoose from 'mongoose'

export const schema = {
  loginName: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    unique: false,
    required: true
  },
  password: {
    required: true,
    type: String,
  },
  roles: {
    type: Array,
    required: true,
  }
};

const userSchema = new mongoose.Schema(schema, { timestamps: true });

export const User = mongoose.model('user', userSchema);