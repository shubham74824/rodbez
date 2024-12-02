// services/driverService.ts
import Driver from '../models/driverModel';

// Function to get available drivers based on location and car type
export const getAvailableDrivers = async (location: string, carType: string) => {
  try {
    const availableDrivers = await Driver.findAll({
      where: {
        availability: true,
        carType: carType,
        location: location,  // Assuming simple location match, but this could be more complex
      },
    });
    return availableDrivers;
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    throw new Error('Could not fetch available drivers');
  }
};

// Function to update driver availability
export const updateDriverAvailability = async (driverId: number, availability: boolean) => {
  try {
    const driver = await Driver.findByPk(driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }
    driver.availability = availability;
    await driver.save();
    return driver;
  } catch (error) {
    console.error('Error updating driver availability:', error);
    throw new Error('Could not update driver availability');
  }
};
