import {DataType,DataTypes,Model} from 'sequelize';
import sequelize from '../config/database';

export class CarType extends Model{
    public id!:number;
    public car_type!:string;
    public price_per_km!:number;
};

CarType.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
            allowNull:false
        },
        car_type:{
            type:DataTypes.STRING,
            allowNull:false
        },
        price_per_km:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
        }
    },
    {
        sequelize,
        tableName:'car_type',
        timestamps:false
    }
);
