import { getDistanceAndTime } from "../utils/distanceUtills";

export const calculateDistanceAndTime = async (
  entryPoint: string,
  destinationPoint: string
) => {
  const { distance, time } = await getDistanceAndTime(entryPoint, destinationPoint);

  // Car prices based on distance
  const baseRate = 10; // Basic car: ₹10 per km
  const carDetails = [
    { car_type: "basic", price: distance * baseRate },
    { car_type: "luxury", price: distance * baseRate * 2 },
    { car_type: "premium", price: distance * baseRate * 3 },
  ];

  return {
    distance: distance.toFixed(2), // Distance in km
    time: time.toFixed(2), // Time in hours
    carDetails,
  };
};
