import mongoose from 'mongoose'

export const schema = {
  name: {
    type: String,
    unique: true,
    required: true
  },
  subjects: {
    type: Array,
  },
  password: {
    required: true,
    type: String,
  }
};

const studentSchema = new mongoose.Schema(schema, { timestamps: true });

export const Student = mongoose.model('student', studentSchema);