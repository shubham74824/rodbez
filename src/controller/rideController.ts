// controllers/rideController.ts
import { Request, Response } from "express";
import * as rideService from "../services/rideServices";
import { handleResponse } from "../utils/responseHandler";


// Request a ride (main function to request a ride)
const requestRide = async (req: Request, res: Response): Promise<void> => {
    try {
      const { pickupLocation, destinationLocation, carType } = req.body;
      const riderId = req.user.id; // Use user ID from the JWT token
  
      // Call the service to create a new ride request
      const newRide = await rideService.createRideRequest(
        riderId,
        pickupLocation,
        destinationLocation,
        carType
      );
  
      // Send success response
      res.status(201).json({ message: "Ride requested successfully", ride: newRide });
    } catch (err) {
      console.error(err);
      handleResponse(res, 500, "Error in requesting ride");
    }
  };

// This method lists completed rides for the rider
const listCompletedRides = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.user.id; // Use user ID from the JWT token

    // Call the service to fetch the list of completed rides
    const rides = await rideService.getCompletedRides(riderId);

    // Send the response back to the client
    res.status(200).json({ message: "Completed rides fetched", rides });
  } catch (err) {
    console.error(err);
    handleResponse(res, 500, "Error fetching completed rides");
  }
};

export { requestRide, listCompletedRides };

