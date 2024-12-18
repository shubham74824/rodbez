import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  
}

const config: Record<string, DBConfig> = {
  development: {
    username: process.env.DB_USER || "default_user",
    password: process.env.DB_PASS || "default_pass",
    database: process.env.DB_NAME || "default_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
};

export default config;
