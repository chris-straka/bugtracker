import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/sequelize";

export class ProjectComment extends Model {
  public id!: number;
  public owner_id!: number;
  public project_id!: number;
  public created_at!: Date;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProjectComment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ProjectComment',
  tableName: 'ProjectComments',
  timestamps: true,
  updatedAt: 'last_modified_at',
});
