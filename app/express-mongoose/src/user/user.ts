import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'project_manager' | 'developer' | 'contributor';
  created_at: Date;
  last_modified_at: Date;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'project_manager', 'developer', 'contributor'], required: true },
  created_at: { type: Date, default: Date.now },
  last_modified_at: { type: Date, default: Date.now },
});

export const UserModel = model<User>('User', userSchema);
