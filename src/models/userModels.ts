import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface userAttributes {
  id?: number;
  name: string;
  mobile_Number: string;
  password: string;
  type: "RIDER" | "DRIVER";
  rating?: number;
}

export class User extends Model<userAttributes> implements userAttributes {
  public id!: number;
  public name!: string;
  public mobile_Number!: string;
  public password!: string;
  public type!: "RIDER" | "DRIVER";
  public rating!: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_Number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("RIDER", "DRIVER"),
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 5.0,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);
export default User;