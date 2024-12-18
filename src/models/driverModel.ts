// models/driver.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // Make sure this is correctly pointing to your Sequelize instance

// Define the type for the driver attributes (includes optional createdAt, updatedAt, id)
export interface driverAttributes {
  id: number;
  name: string;
  phoneNumber: string;
  status: string;
  password: string;  
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the type for driver creation (does not include id, createdAt, updatedAt)
export interface driverCreationAttributes extends Optional<driverAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Driver model using Sequelize
export class Driver extends Model<driverAttributes, driverCreationAttributes> implements driverAttributes {
  public id!: number;
  public name!: string;
  public phoneNumber!: string;
  public status!: string;
  public password!: string;  // Add password to the model
  public createdAt!: Date;
  public updatedAt!: Date;
}

Driver.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,  // Ensure that the password is required
    },
  },
  {
    sequelize,
    tableName: 'drivers',
  }
);
