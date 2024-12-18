import express, { Router } from "express";
import UserController from '../controller/userController'; 
import { authenticateJWT } from "../middleware/auth";
import { driverAuth } from "../middleware/driverAuth";
import { bookRide } from "../controller/rideController";
import { getDistanceDetails } from "../controller/tripController";
import { getAllRides } from "../controller/rideController";

// driver part

import DriverController from "../controller/driverController";

const router: Router = express.Router();

// User routes
router.post('/registerUser', UserController.register);
router.post('/userLogin', UserController.login);
router.post('/refreshToken', UserController.refreshAccessToken);

router.get("/userProfile",authenticateJWT,UserController.getUserDetails)

router.post('/calculate-trip',getDistanceDetails)

router.post('/bookRider', authenticateJWT, bookRide);

router.get("/getRiderStats",authenticateJWT,getAllRides)




// driver part

router.post("/registerDriver",DriverController.register)
router.post("/driverLogin",DriverController.login);
router.get("/driverDetails",driverAuth,DriverController.getDriverDetails);

router.patch("/acceptRideRequest/:rideId",driverAuth,DriverController.acceptRide)


export default router;
