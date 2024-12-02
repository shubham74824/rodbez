import { Sequelize } from "sequelize";
import Config from "./config";

const env = process.env.NODE_ENV || "development"; // Default to 'development'
const dbConfig = Config[env];
// initialize sequalize connection ;

const sequelize = new Sequelize(
  dbConfig.database, // Database name
  dbConfig.username, // Database username
  dbConfig.password, // Database password

  {
    host: dbConfig.host, // Database host
    dialect: dbConfig.dialect as any, // Database dialect
    logging: false, // Disable logging for cleaner output
  }
);

export default sequelize;
