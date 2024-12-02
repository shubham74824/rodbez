// services/rideService.ts
import Ride from '../models/rideRequestModel';
import Driver from '../models/driverModel';
import { calculatePrice } from './pricingServices';  // Assuming you have a separate pricing service

// Function to create a new ride request
export const createRideRequest = async (
  riderId: number,
  pickupLocation: string,
  destinationLocation: string,
  carType: string
) => {
  try {
    // Step 1: Fetch available drivers based on pickup location and car type
    const availableDrivers = await getAvailableDrivers(pickupLocation, carType);

    if (availableDrivers.length === 0) {
      throw new Error("No available drivers for the selected car type");
    }

    // Step 2: Choose the first available driver (for simplicity)
    const selectedDriver = availableDrivers[0];  // You can implement more advanced selection logic (e.g., based on proximity)

    // Step 3: Calculate the ride price
    const price = calculatePrice(pickupLocation, destinationLocation); // You can enhance this logic as needed

    // Step 4: Create the ride request in the database
    const rideRequest = await Ride.create({
      riderId,
      driverId: selectedDriver.id,  // Assign the selected driver
      pickupLocation,
      destinationLocation,
      carType,
      price,
      status: 'pending',  // Initial status is 'pending' until accepted by a driver
    });

    return rideRequest;  // Return the created ride request
  } catch (error) {
    console.error('Error creating ride request:', error);
    throw new Error('Could not create ride request');
  }
};

// Function to fetch completed rides for a rider
export const getCompletedRides = async (riderId: number) => {
  try {
    // Fetch completed rides for the given rider
    const completedRides = await Ride.findAll({
      where: {
        riderId,
        status: 'completed',  // Only fetch completed rides
      },
    });
    return completedRides;
  } catch (error) {
    console.error('Error fetching completed rides:', error);
    throw new Error('Could not fetch completed rides');
  }
};

// Function to get available drivers based on location and car type
export const getAvailableDrivers = async (location: string, carType: string) => {
  try {
    // Find drivers that are available and match the requested car type and location
    const availableDrivers = await Driver.findAll({
      where: {
        availability: true,
        carType,
        location,  // This could be enhanced with geospatial queries for better accuracy
      },
    });
    return availableDrivers;
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    throw new Error('Could not fetch available drivers');
  }
};
