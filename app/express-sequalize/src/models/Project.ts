import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/sequelize";

export class Project extends Model {
  public id!: number;
  public owner_id!: number;
  public name!: string;
  public description!: string;
  public created_at!: Date;
  public last_modified_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init({
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  last_modified_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
},
  {
    sequelize,
    modelName: 'Project',
    tableName: 'Projects',
  }
)