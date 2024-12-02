export const getDistanceFromLatLonInKm = (): number => {
    const currentHour = new Date().getHours();
  
    // Surge pricing multiplier logic based on time of day
    if (currentHour >= 18 && currentHour <= 22) {
      return 1.5;  // Peak hours (6 PM to 10 PM)
    } else if (currentHour >= 7 && currentHour <= 9) {
      return 1.2;  // Morning rush (7 AM to 9 AM)
    } else {
      return 1.0;  // Off-peak hours
    }
  };
  