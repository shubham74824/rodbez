import { Response } from 'express';

export const handleResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): void => {
   res.status(statusCode).json({
    message,
    data,
  });
};
