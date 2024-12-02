import jwt from "jsonwebtoken";
import { handleResponse } from "./responseHandler";
import { Response } from "express";
const JWT_SECRET = process.env.JWT_SECRET;

// create access and refresh token ;

const genrateToken = (user: { id: number }) => {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// varify the jwt token

// Verify JWT token
const verifyToken = (token: string,res:Response) => {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch (error) {
    //   handle different kind of errors with appropriate status  code
    if (error instanceof jwt.TokenExpiredError) {
      // Handle expired token
      return handleResponse(res,401, "Token has expired");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      // Handle invalid token
      return handleResponse(res,400, "Invalid token");
    }

    // For any other unknown error
    return handleResponse(res,500, "An error occurred while verifying the token");
  }
};

export {genrateToken,verifyToken}