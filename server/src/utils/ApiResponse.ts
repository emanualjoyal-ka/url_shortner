import type { Response } from "express";

type ApiResponse<T> = {
  success: true;
  message: string;
  data?: T;
};

export const sendResponse = <T>(res: Response,payload: 
    { statusCode: number;
      message: string;
      data: T }) => {

  return res.status(payload.statusCode).json({
    success: true,
    message: payload.message,
    data: payload.data,
  } satisfies ApiResponse<T>);

};