import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Driver } from '../models/driverModel';
import { driverCreationAttributes } from '../models/driverModel';  // Assuming driverAttributes exists
import Ride from '../models/rideRequestModel';
import { RideStatus } from '../enum/rideAcceptEnum';

const JWT_SECRET = process.env.JWT_SECREAT;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const JWT_REFRESH_EXPIRATION_TIme = process.env.JWT_REFRESH_EXPIRATION_TIme;

class DriverServices {
  // Register New Driver
  static async register(driverData: driverCreationAttributes) {
    const { name, phoneNumber, status,password } = driverData;

  try {

    console.log("Registering driver with data:", driverData);
    // Check if the phone number already exists
    const existingDriver = await Driver.findOne({ where: { phoneNumber } });

    if (existingDriver) {
      return {
        success: false,
        statusCode: 409,
        message: 'Phone number already exists',
      };
    }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const newDriver = await Driver.create({
        name,
        phoneNumber,
        password: hashedPassword,  // Save the hashed password
        status,
      });
      console.log("newDriver....",newDriver)

    return {
      success: true,
      message: 'Driver created successfully',
      data: newDriver,
    };
  } catch (error) {
    console.error("Error during driver registration:", error); // Log detailed error
    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    };
  }
};

// login server for the driver
static async login(phoneNumber: string, password: string): Promise<any> {
    try {
      const driver = await Driver.findOne({
        where: { phoneNumber },
      });

      if (!driver) {
        return { success: false, statusCode: 404, message: "Driver not found" };
      }

      // Validate password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, driver.password);

      if (!isPasswordValid) {
        return { success: false, statusCode: 400, message: "Incorrect password" };
      }

      // Generate JWT tokens
      if (!JWT_SECRET) {
        return {
          success: false,
          statusCode: 500,
          message: "JWT_SECRET is not defined",
        };
      }

      const accessToken = jwt.sign(
        { driverId: driver.id, name: driver.name, phoneNumber: driver.phoneNumber },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      const refreshToken = jwt.sign(
        { driverId: driver.id },
        JWT_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRATION_TIme }
      );

      return {
        success: true,
        message: "Login successful",
        data: { accessToken, refreshToken },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: 500,
        message: "Internal server error",
      };
    }
}


  // Accept Rider Request
  static async acceptRide(driverId: number, rideId: number): Promise<any> {
    try {
      const ride = await Ride.findOne({ where: { id: rideId } });
       console.log("ridr,,,",ride)
      if (!ride) {
        return {
          success: false,
          statusCode: 404,
          message: "Ride not found",

        };
      }
  
      if (ride.status !== RideStatus.PENDING) {
        return {
          success: false,
          statusCode: 400,
          message: "This ride is already accepted or completed",
        };
      }
  
      const updatedRide = await ride.update({
        status: RideStatus.ACCEPTED,
        driverId: driverId,
      });
  
      return {
        success: true,
        message: "Ride accepted successfully",
        data: updatedRide,
      };
    } catch (error) {
      console.error("Error in acceptRide service:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Internal server error",
      };
    }}

  // Get Driver By ID
  static async getDriverById(driverId: string) {
    try {
      const driver = await Driver.findOne({
        where: { id: driverId },
        attributes: ['name', 'phoneNumber', 'status'],
      });

      if (!driver) {
        return { success: false, statusCode: 404, message: 'Driver not found' };
      }

      return { success: true, data: driver };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Internal Server Error' };
    }
  }
}

export default DriverServices;
