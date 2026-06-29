import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";


const errorHandler = (err:Error|ApiError, req:Request, res:Response, next:NextFunction) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500

    res.status(statusCode).json({
        success: false,
        message: err instanceof ApiError ? err.message : "Internal Server Error"
    });

};

export default errorHandler;