import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModels";

import { userAttributes } from "../models/userModels";

// Environment variables

const JWT_SECRET = process.env.JWT_SECREAT;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const JWT_REFRESH_EXPIRATION_TIme = process.env.JWT_REFRESH_EXPIRATION_TIme;

class UserService {
  // Register New User

  static async register(userData: userAttributes) {
    const { name, mobile_Number, password, type } = userData;
    try {
      // check mobile number already exist then share the status code and error response

      const existingUser = await User.findOne({ where: { mobile_Number } });

      if (existingUser) {
        return {
          sucess: false,
          statusCode: 409,
          message: "Mobile Number already exist ",
        };
      }

      // hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        mobile_Number,
        password: hashedPassword,
        type,
        rating: 5.0,
      });
      return {
        success: true,
        message: "User created successfully",
        data: newUser,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: "Internal server error",
      }; // Handle errors here
    }
  }

  // login and genrate jwt tokens
  static async login(mobile_Number: string, password: string): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          mobile_Number,
        },
      });

      if (!user) {
        return { success: false, statusCode: 404, message: "User not found" };
      }
      // compare the given password with the stored hashed password

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Incorrect mobile number or password",
        };
      }

      let accessToken, refreshToken;
      try {
        accessToken = jwt.sign(
          { userId: user.id, type: user.type },
          JWT_SECRET as string,
          { expiresIn: JWT_EXPIRATION }
        );

        refreshToken = jwt.sign(
          { userId: user.id, type: user.type },
          JWT_SECRET as string,
          { expiresIn: JWT_REFRESH_EXPIRATION_TIme }
        );
      } catch (error) {
        console.error("Error generating tokens:", error);
        return { success: false, message: "Failed to generate tokens" };
      }
      return {
        success: true,
        data: { accessToken, refreshToken },
      };
    } catch (error) {
      return { success: false, message: "Internal server error" };
    }
  }
  // Refresh & access token using refresh token

  static async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        JWT_SECRET as string
      ) as jwt.JwtPayload;
      const { userId, type } = decoded;
      const accessToken = jwt.sign({ userId, type }, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRATION,
      });
      return { success: true, data: { accessToken } };
    } catch (error) {
      return { success: false, message: "Invalid or expired token" };
    }
  }

  // based upon the token that we got now lets try to share the profile based upon the token
  static async getUserById(userId: string) {
    try {
      const user = await User.findOne({
        where: { id: userId },
        attributes: ["name", "mobile_Number", "type", "rating"],
      });

      if (!user) {
        return { success: false, statusCode: 400, message: "User not found " };
      }
      return user;
    } catch (error) {
      if (Error instanceof Error) {
        return {
          sucess: false,
          statusCode: 500,
          message: "Internal Server Error ",
        };
      }
    }
  }
}
export default UserService;
