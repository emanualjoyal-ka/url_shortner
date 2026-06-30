import type { Request, Response } from "express";
import { adminServices } from "../services/admin.service.js";
import { sendResponse } from "../utils/ApiResponse.js";


export const getAllUrls=async(req:Request,res:Response)=>{
    const user=req.user!.userId;
    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 5;
    const repsonse=await adminServices.getAllUrls(user,page,limit);
    return sendResponse(res,{
        statusCode:200,
        data:repsonse
    })
}