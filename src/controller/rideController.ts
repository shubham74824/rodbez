import { Request, Response } from 'express';
import { createBooking } from '../services/riderService';
import { handleResponse } from '../utils/responseHandler';
import { getRideDetails } from '../services/riderService';
export const bookRide = async (req: Request, res: Response): Promise<void> => {
    try {
        const {  carType, startPoint, endPoint, distance, time, carDetails } = req.body;


         // Get riderId from authenticated token
         const riderId = (req as any).userId;

         if (!riderId) {
             handleResponse(res,403, 'Rider ID is missing from token.', );
             return;
         }

        // Validate required fields
        if (!riderId || !carType || !startPoint || !endPoint || !distance || !time || !carDetails) {
            handleResponse(res,400, 'All fields are required.' );
            return;
        }

        // Create a booking
        const result = await createBooking({ riderId, carType, startPoint, endPoint, distance, time, carDetails });

        // Send success response
        handleResponse(res, 200,'Ride booked successfully.', result);
    } catch (error: any) {
        handleResponse(res,500, error.message || 'An error occurred.', );
    }
};


// get getRideStats of a single user




export const getAllRides = async (req: Request, res: Response): Promise<void> => {
    try {
        const riderId = (req as any).userId; // Get riderId from the authenticated token

        if (!riderId) {
            res.status(403).json({ message: 'Rider ID is missing from token.' });
            return;
        }

        // Fetch all ride details for the rider
        const rides = await getRideDetails(riderId);

        // Check if rides exist for this rider
        if (rides.length === 0) {
            res.status(404).json({
                message: 'No rides found for this rider.'
            });
            return;
        }

        res.status(200).json({
            message: 'Ride details retrieved successfully.',
            data: rides
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || 'An error occurred while fetching ride details.',
        });
    }
};

