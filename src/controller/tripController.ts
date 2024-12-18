import { Request, Response } from "express";
import { calculateDistanceAndTime } from "../services/tripServices";

export const getDistanceDetails = async (req: Request, res: Response) => {
  try {
    const { entryPoint, destinationPoint } = req.body;

    if (!entryPoint || !destinationPoint) {
       res.status(400).json({
        success: false,
        message: "entryPoint and destinationPoint are required.",
      });
    }

    const result = await calculateDistanceAndTime(entryPoint, destinationPoint);

     res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
     res.status(500).json({
      success: false,
      message: error.message || "An error occurred.",
    });
  }
};
