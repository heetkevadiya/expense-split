import { Sequelize, Model, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); 

const sequelizeTZ = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: true,
    timezone: "+00:00",
  }
);

// ✅ Direct Supabase Database Connection
// const sequelizeTZ = new Sequelize(
//   process.env.SUPABASE_DB_URL,
//   {
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: true,
//     timezone: "+00:00",
//   }
// );

const connection = {};

connection.Sequelize = Sequelize;
connection.sequelizeTZ = sequelizeTZ;
connection.Model = Model;
connection.DataTypes = DataTypes;

export default connection;

