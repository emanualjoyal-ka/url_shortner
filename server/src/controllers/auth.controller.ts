import type { Request, Response } from "express";
import { userServices } from "../services/auth.service.js";
import { sendResponse } from "../utils/ApiResponse.js";


export const createUser=async(req:Request,res:Response)=>{
    const user=await userServices.createUser(req.body)
    return sendResponse(res,{
        statusCode:201,
        message:"User created successfully",
        data:user
    })
}