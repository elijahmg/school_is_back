import mongoose, { Schema, Document } from 'mongoose'

export const UserSchema = {
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
  subjects: {
    type: [String],
  }
};

export interface UserInterface extends Document {
  loginName: string,
  name: string,
  password: string,
  subjects: Array<string>
}

const userSchema: Schema = new Schema(UserSchema, { timestamps: true });

export const User = mongoose.model<UserInterface>('user', userSchema);