import dbconfig from "../config/cofig.js";

const model = dbconfig.Sequelize.Model;
const sequelize = dbconfig.sequelizeTZ;
const { DataTypes } = dbconfig;

class Expense extends model {}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paid_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    split_type: {
      type: DataTypes.ENUM('equal', 'manual', 'percentage', 'shares'),
      allowNull: false,
      defaultValue: 'equal',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Expense",
    tableName: "expenses",
    timestamps: false,
  }
);

export default Expense;
