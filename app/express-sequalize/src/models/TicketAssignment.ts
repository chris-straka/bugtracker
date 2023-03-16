import { Model, DataTypes } from "sequelize"
import { sequelize } from "../../config/sequelize";

export class TicketAssignment extends Model {
  public ticket_id!: number;
  public developer_id!: number;
}

TicketAssignment.init({
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tickets',
      key: 'id',
    },
  },
  developer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'TicketAssignment',
  tableName: 'TicketAssignments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['ticket_id', 'developer_id'],
    },
  ],
});