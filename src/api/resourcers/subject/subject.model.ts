import mongoose, { Schema, Document } from 'mongoose'

export const SubjectSchema = {
  name: {
    type: String,
    unique: true,
    required: true,
  }
};

export interface SubjectInterface extends Document {
  name: string,
}

const subjectSchema: Schema = new Schema(SubjectSchema, { timestamps: true });

export const Subject = mongoose.model<SubjectInterface>('subject', subjectSchema);