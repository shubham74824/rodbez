import { DataTypes } from "sequelize";
import sequelize from "../config/database"; // Import your sequelize instance

const Rider = sequelize.define(
  "Rider",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Automatically generates a unique UUID
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensures the email format is valid
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW, // Updates automatically when the record is updated
    },
  },
  {
    tableName: "riders", // Ensure the model corresponds to the 'riders' table
    timestamps: false, // Since `created_at` and `updated_at` are already handled in the table
  }
);

export default Rider;
