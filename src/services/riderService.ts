import Booking from "../models/rideRequestModel"
interface BookingRequest {
    riderId: string; // Now always received from middleware
    carType: string;
    startPoint: string;
    endPoint: string;
    distance: number;
    time: number;
    carDetails: { car_type: string; price: number }[];
}

export const createBooking = async (data: BookingRequest) => {
    const { riderId, carType, startPoint, endPoint, distance, time, carDetails } = data;

    // Validate car type
    const selectedCar = carDetails.find((car) => car.car_type === carType);
    if (!selectedCar) {
        throw new Error(`Car type '${carType}' is not available.`);
    }

    // Get the price of the selected car type
    const price = selectedCar.price;

    // Create a new booking in the database
    const booking = await Booking.create({
        riderId,
        carType,
        startPoint,
        endPoint,
        price,
        status: 'PENDING',
    });

    // Return booking details and ride info
    return {
        booking,
        distance,
        time,
    };
};


// get specific ridestats of single user 



export const getRideDetails = async (riderId: string) => {
    try {
        // Fetch all bookings for a specific rider
        const bookings = await Booking.findAll({
            where: { riderId },
            attributes: ['id', 'carType', 'startPoint', 'endPoint', 'price', 'status', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']] // Optional: Sort by created date (most recent first)
        });

        return bookings; // Return the bookings with full details
    } catch (error: any) {
        throw new Error(`Error fetching ride details: ${error.message}`);
    }
};