import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";


export const authorize=(...roles:string[])=>{ // do type for roles (USER,ADMIN)
    return (req:Request,_res:Response,next:NextFunction)=>{
        if(!req.user){
            throw new ApiError("Unauthorized",401)
        }
        if(!roles.includes(req.user.role)){
            throw new ApiError("Forbidden",403)
        }
        next();
    }
}