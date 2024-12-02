// services/pricingService.ts
import { getDistanceFromLatLonInKm } from '../utils/fareCalculator';  // You can implement this utility or use a package like geolib

// This function calculates the price of a ride based on distance
export const calculatePrice = (pickupLocation: string, destinationLocation: string) => {
  // Example of basic pricing logic
  const baseFare = 10;  // Base fare in dollars
  const pricePerKm = 2; // Price per kilometer in dollars

  // Assume pickupLocation and destinationLocation are in the format of 'latitude,longitude'
  const [pickupLat, pickupLng] = pickupLocation.split(',').map(Number);
  const [destLat, destLng] = destinationLocation.split(',').map(Number);

  // Calculate the distance between the pickup and destination locations (in km)
  const distance = getDistanceFromLatLonInKm(pickupLat, pickupLng, destLat, destLng);

  // Basic pricing calculation: base fare + distance * price per km
  const price = baseFare + distance * pricePerKm;

  return price;
};
