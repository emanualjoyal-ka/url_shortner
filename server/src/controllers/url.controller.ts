import type { Request, Response } from "express";
import { urlServices } from "../services/url.service.js";
import { sendResponse } from "../utils/ApiResponse.js";



export const createUrl=async(req:Request,res:Response)=>{
    const userId=req.user!.userId;
    const urlResponse=await urlServices.createUrl(req.body,userId);
    return sendResponse(res,{
        statusCode:201,
        message:"URL created successfully",
        data:urlResponse
    })
}

export const redirectUrl=async(req:Request,res:Response)=>{
    const shortCode=req.params.shortCode;
    const response=await urlServices.redirectUrl(shortCode,req);
    return res.redirect(302,response)
}

export const getAllUrls=async(req:Request,res:Response)=>{
    const userId=req.user!.userId;
    const page=Number(req.query.page) || 1;
    const limit=Number(req.query.limit) || 5;
    const repsonse=await urlServices.getAllUrls(userId,page,limit);
    return sendResponse(res,{
        statusCode:200,
        data:repsonse
    })
}

export const deleteUrl=async(req:Request,res:Response)=>{
    const userId=req.user!.userId;
    const shortCode=req.params.shortCode
    await urlServices.deleteUrl(shortCode,userId)
    return sendResponse(res,{
        statusCode:200,
        message:"URL deleted successfully"
    })
}

export const updateUrl=async(req:Request,res:Response)=>{
    const userId=req.user!.userId;
    const shortCode=req.params.shortCode
    await urlServices.updateUrl(shortCode,userId,req.body)
    return sendResponse(res,{
        statusCode:204
    })
}