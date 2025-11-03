import dbconfig from "../config/cofig.js";

const model = dbconfig.Sequelize.Model;
const sequelize = dbconfig.sequelizeTZ;
const { DataTypes } = dbconfig;

class ExpenseSplit extends model {}

ExpenseSplit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ExpenseSplit",
    tableName: "expense_splits",
    timestamps: false,
  }
);

export default ExpenseSplit;
