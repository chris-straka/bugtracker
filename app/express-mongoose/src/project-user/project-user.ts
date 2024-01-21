import { Schema, Document, model } from 'mongoose';
import { Project } from '../project/project';
import { User } from '../user/user';

/** 
 * TODO: Remove this and nest the this in the Project.
 */
export interface ProjectUser extends Document {
  project_id: Project['_id'];
  user_id: User['_id'];
}

const projectUserSchema = new Schema({
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const ProjectUserModel = model<ProjectUser>('ProjectUser', projectUserSchema);
