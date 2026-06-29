import type { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import ApiError from "../utils/ApiError.js";


export const validate =(schema: ZodType) => (req: Request,res: Response,next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
       if (error instanceof ZodError) {
        return next(new ApiError(error.issues[0]?.message ?? "Validation failed" , 400));
      }
      next(error);
    }
  };