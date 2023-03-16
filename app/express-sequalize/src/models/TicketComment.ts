import { Model, DataTypes } from "sequelize"
import { sequelize } from "../../config/sequelize";

export class TicketComment extends Model {
  public id!: number;
  public owner_id!: number;
  public description!: string;
  public ticket_id!: number;
  public created_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TicketComment.init({
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
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tickets',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'TicketComment',
  tableName: 'TicketComments',
  timestamps: true,
  updatedAt: 'last_modified_at',
});
