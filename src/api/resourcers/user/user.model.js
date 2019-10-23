import mongoose from 'mongoose'

export const schema = {
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    required: true,
    type: String,
  }
};

const userSchema = new mongoose.Schema(schema, { timestamps: true });

export const User = mongoose.model('user', userSchema);