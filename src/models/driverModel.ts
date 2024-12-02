// models/Driver.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // assuming sequelize is configured

// Define the attributes interface for the Driver model
interface DriverAttributes {
  id: number;
  name: string;
  carType: string;
  rating: number;
  availability: boolean;
  location: string;  // Store location in some format (could be a string or JSON)
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes interface
interface DriverCreationAttributes extends Optional<DriverAttributes, 'id'> {}

class Driver extends Model<DriverAttributes, DriverCreationAttributes> implements DriverAttributes {
  public id!: number;
  public name!: string;
  public carType!: string;
  public rating!: number;
  public availability!: boolean;
  public location!: string;  // Storing location as string for simplicity

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Driver.init(
  {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      carType: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      rating: {
          type: DataTypes.FLOAT,
          defaultValue: 0,
          allowNull: false,
      },
      availability: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
      },
      location: {
          type: DataTypes.STRING, // Could be geospatial data (latitude, longitude)
          allowNull: false,
      },
      id: ''
  },
  {
    sequelize,
    tableName: 'drivers',
    timestamps: true,
    underscored: true,
  }
);

export default Driver;
