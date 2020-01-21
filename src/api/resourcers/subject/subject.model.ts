import mongoose from 'mongoose';

export const schema = {
  name: {
    type: String,
    unique: true,
    required: true,
  }
};

const subjectSchema = new mongoose.Schema(schema, { timestamps: true });

export const Subject = mongoose.model('subject', subjectSchema);