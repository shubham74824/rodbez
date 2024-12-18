import { Request, Response, NextFunction } from "express";
import DriverServices from "../services/driverService";
import { driverCreationAttributes } from "../models/driverModel";
import { handleResponse } from "../utils/responseHandler";
import { CustomRequest } from "../types/customInterface";

class DriverController {
  // Register New Driver
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        name,
        phoneNumber,
        status = "available",
        password,
      }: driverCreationAttributes = req.body;

      // Validate required fields
      if (!name || !phoneNumber) {
        return handleResponse(res, 400, "Please provide all required details");
      }

      const driver = await DriverServices.register({
        name,
        phoneNumber,
        status,
        password,
      });
     console.log("driver part...",driver)
      if (!driver.success) {
        return handleResponse(res, driver.statusCode || 400, driver.message);
      }

      // Return a successful response
      return handleResponse(res, 201, "Driver created successfully", driver);
    } catch (error) {
      if (error instanceof Error) {
        return handleResponse(res, 500, "Internal Server Error");
      }
      next(error); // Propagate error to global error handler
    }
  }

  //   login part for the driver
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { phoneNumber, password } = req.body;

      // Validate input
      if (!phoneNumber || !password) {
        return handleResponse(
          res,
          400,
          "Phone number and password are required"
        );
      }

      // Call the service for login
      const result = await DriverServices.login(phoneNumber, password);

      if (!result.success) {
        return handleResponse(res, result.statusCode || 400, result.message);
      }

      // Successful login, return token data
      return handleResponse(res, 200, result.message, result.data);
    } catch (error) {
      console.error(error);
      return handleResponse(res, 500, "Internal Server Error");
    }
  }

  // Accept Rider Request (or other driver actions)
  static async acceptRide(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { rideId } = req.params; // Ride ID from the URL
      const driverId = req.driverId; // Now recognized as part of CustomRequest
  
      // Validate rideId
      if (!rideId) {
         res.status(400).json({
          success: false,
          message: "Ride ID is required",
        });
      }
  
      const result = await DriverServices.acceptRide(
        Number(driverId),
        Number(rideId)
      );
  
      // Handle failure
      if (!result.success) {
         res.status(result.statusCode || 400).json({
          success: false,
          message: result.message,
        });
        return
      }
  
      // Successful response
       res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
      return
    } catch (error) {
      console.error(error);
       res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
      return 
    }
  }
  // Get Driver Details
  static async getDriverDetails(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const driverId = req.driverId;
     
      if (!driverId) {
        return handleResponse(res, 400, "Driver not authenticated");
      }

      const driver = await DriverServices.getDriverById(driverId);

      if (!driver) {
        return handleResponse(res, 404, "Driver not found");
      }

      return handleResponse(
        res,
        200,
        "Driver details fetched successfully",
        driver
      );
    } catch (error) {
      if (error instanceof Error) {
        return handleResponse(res, 500, "Internal Server Error");
      }
      next(error); // Propagate error to global error handler
    }
  }
}

export default DriverController;
