import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getDistanceAndTime = async (
  entryPoint: string,
  destinationPoint: string
): Promise<{ distance: number; time: number }> => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    entryPoint
  )}&destinations=${encodeURIComponent(
    destinationPoint
  )}&mode=driving&key=${apiKey}`;

  const response = await axios.get(url);
  const data = response.data;

  if (data.status !== "OK") {
    throw new Error("Failed to fetch distance and time from Google Maps API");
  }

  const distanceMeters = data.rows[0].elements[0].distance.value;
  const durationSeconds = data.rows[0].elements[0].duration.value;

  return {
    distance: distanceMeters / 1000, // Convert to kilometers
    time: durationSeconds / 3600, // Convert to hours
  };
};
