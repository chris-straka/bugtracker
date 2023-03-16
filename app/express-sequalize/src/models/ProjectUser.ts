import { Model, DataTypes } from "sequelize"
import { sequelize } from "../../config/sequelize";

export class ProjectUser extends Model {
  public project_id!: number;
  public user_id!: number;
}

ProjectUser.init({
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'ProjectUser',
  tableName: 'ProjectUsers',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['project_id', 'user_id'],
    },
  ],
});