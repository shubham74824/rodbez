import { QueryTypes, Sequelize } from "sequelize";
import Driver from "../models/driverModel"; // Assuming Driver is defined in models

// Define the structure of the returned driver object
interface NearestDriver {
  driver_id: number;
  distance: number;
}

class DriverRepo {
  /**
   * Finds the nearest available driver within 2.5km (6000 meters) of the pickup location.
   *
   * @param pickupLat - Latitude of the pickup location
   * @param pickupLon - Longitude of the pickup location
   * @returns A promise that resolves to the nearest driver object or null if no driver is found
   */
  static async findNearestDriver(
    pickupLat: number,
    pickupLon: number
  ): Promise<NearestDriver | null> {
    console.log(pickupLat);

    // Validate latitude and longitude before proceeding
    if (!this.isValidLatitude(pickupLat) || !this.isValidLongitude(pickupLon)) {
      throw new Error("Invalid latitude or longitude provided.");
    }

    // Ensure Driver.sequelize is available
    if (!Driver.sequelize) {
      throw new Error("Sequelize instance is not available.");
    }

    const query = `
      SELECT 
        id AS driver_id, 
        ST_Distance_Sphere(current_location, ST_GeomFromText(:pickup_location)) AS distance
      FROM drivers
      WHERE ST_Distance_Sphere(current_location, ST_GeomFromText(:pickup_location)) <= 6000
      ORDER BY distance ASC
      LIMIT 1
    `;

    try {
      const drivers: NearestDriver[] = await Driver.sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          pickup_location: `POINT(${pickupLon} ${pickupLat})`,
        },
      });

      // Return the nearest driver or null if no drivers are within range
      return drivers.length > 0 ? drivers[0] : null;
    } catch (error) {
      console.error("Error finding nearest driver:", error);
      throw new Error("Could not find the nearest driver. Please try again later.");
    }
  }

  /**
   * Validates latitude.
   * @param latitude - Latitude to validate
   * @returns True if valid, otherwise false
   */
  private static isValidLatitude(latitude: number): boolean {
    return latitude >= -90 && latitude <= 90;
  }

  /**
   * Validates longitude.
   * @param longitude - Longitude to validate
   * @returns True if valid, otherwise false
   */
  private static isValidLongitude(longitude: number): boolean {
    return longitude >= -180 && longitude <= 180;
  }
}

export default DriverRepo;
