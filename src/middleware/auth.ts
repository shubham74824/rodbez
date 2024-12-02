import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import { handleResponse } from "../utils/responseHandler";
// authenticate Jwt token

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return handleResponse(res,401, "Token has not provided ");
  };
  try{
   const decodeToken=verifyToken(token,res);
   req.user=decodeToken;
   next()
  }catch(error){
    if(error instanceof Error){
        return handleResponse(res,401,"unAuthorized Access") 
    }
 
  }
};
