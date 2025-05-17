// src/infrastructure/database/models/UserModel.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface UserDocument extends Document {
  _id: Types.ObjectId; // Explicitly declare _id
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export default UserModel;