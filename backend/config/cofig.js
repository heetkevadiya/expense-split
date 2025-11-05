import { Sequelize, Model, DataTypes } from "sequelize";


//✅ local postgresql connection
// let dbconfig = {
//     db_name: 'testdb',
//     db_user: 'postgres',
//     db_pass: 'HEETpatel2458.',
//     con_type: 'postgres',
//     port: 5432,
//     host: 'localhost'
// };

// const sequelizeTZ = new Sequelize(dbconfig.db_name, dbconfig.db_user, dbconfig.db_pass, {
//     host: dbconfig.host,
//     dialect: dbconfig.con_type ,
//     port: dbconfig.port,
//     logging: true,
//     timezone: '+00:00'
// });


// ✅ Direct Supabase Database Connection
const sequelizeTZ = new Sequelize(
  "postgresql://postgres:HEETpatel2458.@db.wyjhzpazssggwuoqcuom.supabase.co:5432/postgres",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    logging: true,
    timezone: "+00:00",
  }
);

const connection = {};

connection.Sequelize = Sequelize;
connection.sequelizeTZ = sequelizeTZ;
connection.Model = Model;
connection.DataTypes = DataTypes;

export default connection;
