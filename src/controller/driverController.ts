// controllers/driverController.ts
import { Request, Response } from 'express';
import { getAvailableDrivers, updateDriverAvailability } from '../services/driverServices';
import { handleResponse } from '../utils/responseHandler'; // Assuming you have a response handler utility

// Controller for finding available drivers
export const findAvailableDrivers = async (req: Request, res: Response) => {
  try {
    const { location, carType } = req.query;  // Assuming query params for location and carType
    if (!location || !carType) {
      return handleResponse(res, 400, 'Location and Car Type are required');
    }

    const availableDrivers = await getAvailableDrivers(location as string, carType as string);
    return handleResponse(res, 200, 'Available drivers found', availableDrivers);
  } catch (error) {
    console.error('Error finding available drivers:', error);
    return handleResponse(res, 500, 'An error occurred while finding available drivers');
  }
};

// Controller for updating driver availability
export const setDriverAvailability = async (req: Request, res: Response) => {
  try {
    const { driverId, availability } = req.body;  // Driver ID and availability status

    if (!driverId || availability === undefined) {
      return handleResponse(res, 400, 'Driver ID and availability status are required');
    }

    const updatedDriver = await updateDriverAvailability(driverId, availability);
    return handleResponse(res, 200, 'Driver availability updated', updatedDriver);
  } catch (error) {
    console.error('Error updating driver availability:', error);
    return handleResponse(res, 500, 'An error occurred while updating driver availability');
  }
};
