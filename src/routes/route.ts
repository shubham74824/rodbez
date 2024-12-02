
import express, { Router } from "express";
import UserController from '../controller/userController'; 

const router: Router = express.Router();


router.post('/registerUser', UserController.register);
router.post('/userLogin', UserController.login);
router.post('/refreshToken', UserController.refreshAccessToken);

export default router;
