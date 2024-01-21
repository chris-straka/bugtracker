import { Schema, Document, model } from 'mongoose';
import { User } from '../user/user';
import { Project } from '../project/project';

/** 
 * TODO: Remove this and nest this in the Project.
 */
export interface ProjectComment extends Document {
  owner_id: User['_id'];
  project_id: Project['_id'];
  created_at: Date;
  description: string;
}

const projectCommentSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  created_at: { type: Date, default: Date.now },
  description: { type: String, required: true },
});

export const ProjectCommentModel = model<ProjectComment>('ProjectComment', projectCommentSchema);
