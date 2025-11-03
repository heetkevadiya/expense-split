import dbconfig from "../config/cofig.js";

const model = dbconfig.Sequelize.Model;
const sequelize = dbconfig.sequelizeTZ;
const { DataTypes } = dbconfig;

class Group extends model {}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: "Group",
    tableName: "groups",
    timestamps: false
  }
);

export default Group;
