import { Sequelize, Model, DataTypes } from "sequelize";

let dbconfig = {
    db_name: 'testdb',
    db_user: 'postgres',
    db_pass: 'HEETpatel2458.',
    con_type: 'postgres',
    port: 5432,
    host: 'localhost'
};

const sequelizeTZ = new Sequelize(dbconfig.db_name, dbconfig.db_user, dbconfig.db_pass, {
    host: dbconfig.host,
    dialect: dbconfig.con_type ,
    port: dbconfig.port,
    logging: true,
    timezone: '+00:00'
});

const connection = {};

connection.Sequelize = Sequelize;
connection.sequelizeTZ = sequelizeTZ;
connection.Model = Model;
connection.DataTypes = DataTypes;

export default connection;
