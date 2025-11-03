import dbconfig from "../config/cofig.js";

const model = dbconfig.Sequelize.Model;
const sequelize = dbconfig.sequelizeTZ;
const { DataTypes } = dbconfig;

class GroupMember extends model {}

GroupMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: "GroupMember",
    tableName: "group_members",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["group_id", "user_id"]
      }
    ]
  }
);

export default GroupMember;
