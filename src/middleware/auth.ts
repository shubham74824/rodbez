import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types/customInterface";
import { handleResponse } from "../utils/responseHandler";
export const authenticateJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    handleResponse(res, 403, "Access denaid token missing ");

    return;
  }
  const secret = process.env.JWT_SECREAT;

  if (!secret) {
    handleResponse(res, 403, "JWT secret is not configured ");

    return;
  }
  try {
    const decoded = jwt.verify(token, secret) as { userId: string };

    req.userId = decoded.userId; // No error here now
    next();
  } catch (error) {
    
    handleResponse(res, 500, "Invalid server error");
  }
};
