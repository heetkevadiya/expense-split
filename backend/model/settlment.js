import dbconfig from "../config/cofig.js";

const model = dbconfig.Sequelize.Model;
const sequelize = dbconfig.sequelizeTZ;
const { DataTypes } = dbconfig;

class Settlement extends model {}

Settlement.init(
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
    from_member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_member_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Settlement",
    tableName: "settlements",
    timestamps: false,
  }
);

export default Settlement;
