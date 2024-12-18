import { DataTypes, Model } from 'sequelize';
import  sequelize from '../config/database';  // Ensure this is your Sequelize instance

class Booking extends Model {
    public id!: number;
    public riderId!: string;
    public carType!: string;
    public startPoint!: string;
    public endPoint!: string;
    public price!: number;
    public status!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        riderId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        carType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startPoint: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        endPoint: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'PENDING',
        },
    },
    {
        sequelize,  // Your Sequelize instance
        tableName: 'bookings',  // Table name in the database
    }
);

export default Booking;
