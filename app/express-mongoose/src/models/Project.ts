import { Schema, Document, model } from 'mongoose'
import { User } from './User'

export interface Project extends Document {
  owner_id: User['_id'];
  name: string;
  description: string;
  created_at: Date;
  last_modified_at: Date;
}

const projectSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  last_modified_at: { type: Date, default: Date.now },
})

export const ProjectModel = model<Project>('Project', projectSchema)
