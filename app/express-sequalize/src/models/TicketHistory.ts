import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize';

export class TicketHistory extends Model {
  public id!: number;
  public ticket_id!: number;
  public changer_id!: number;
  public changed_fields!: string[];
  public previous_values!: string[];
  public new_values!: string[];
  public date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TicketHistory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tickets',
      key: 'id',
    },
  },
  changer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  changed_fields: {
    type: DataTypes.ARRAY(DataTypes.STRING(100)),
    allowNull: false,
  },
  previous_values: {
    type: DataTypes.ARRAY(DataTypes.STRING(100)),
    allowNull: false,
  },
  new_values: {
    type: DataTypes.ARRAY(DataTypes.STRING(100)),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'TicketHistory',
  tableName: 'TicketHistory',
  timestamps: true,
  updatedAt: 'last_modified_at',
});
