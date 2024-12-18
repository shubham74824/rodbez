import { Request, Response, NextFunction } from "express";
import UserService from "../services/userService";
import { handleResponse } from "../utils/responseHandler";
import { CustomRequest } from "../types/customInterface";
class UserController {
  // Register New User
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, mobile_Number, password, type } = req.body;

      // Check if all required fields are provided
      if (!name || !mobile_Number || !password || !type) {
        return handleResponse(
          res,
          400,
          "Please provide all the required details"
        );
      }
      const user = await UserService.register({
        name,
        mobile_Number,
        password,
        type,
      });

      if (!user.success) {
        return handleResponse(res, user.statusCode || 400, user.message);
      }

      // Return a successful response with user data
      return handleResponse(res, 201, "User created successfully", user);
    } catch (error) {
      if (error instanceof Error) {
        // Return a response in case of error
        return handleResponse(res, 400, "Something went wrong");
      }
      next(error); // Propagate error to global error handler
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }

  // Login User
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { mobile_Number, password } = req.body;
      const response = await UserService.login(mobile_Number, password);

      if (response.data.accessToken && response.data.refreshToken) {
        return handleResponse(res, 200, "Login successful", {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
      }

      return handleResponse(res, 404, "Invalid credentials");
    } catch (error) {
      if (error instanceof Error) {
        return handleResponse(res, 500, "Internal Server Error");
      }

      next(error); // Propagate error to global error handler
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }

  // Refresh Access Token
  static async refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshAccessToken } = req.body;
      const accessToken = await UserService.refreshAccessToken(
        refreshAccessToken
      );
      return handleResponse(res, 200, "Access token refreshed", {
        accessToken,
      });
    } catch (error) {
      if (error instanceof Error) {
        handleResponse(res, 400, "Invalid or expired token");
      }
      return;
      next(error); // Propagate error to global error handler
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }

  // share the profile details based upon the token

  static async getUserDetails(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        handleResponse(res, 400, "User not authenticated ");

        return;
      }

      // Now, userId is guaranteed to be a string
      const user = await UserService.getUserById(userId);

      if (user) {
        handleResponse(res, 200, "User details sucessfully", user);
        return;
      }

      handleResponse(res, 404, "User not found");
      return ;
    } catch (error) {
      if (error instanceof Error) {
        return handleResponse(res, 500, "Internal Server Error");
      }
    }
  }
}

export default UserController;
