import type { Request, Response } from "express";
import { userServices } from "../services/auth.service.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { refreshCookieOptions } from "../utils/cookie.js";


export const createUser=async(req:Request,res:Response)=>{
    const user=await userServices.createUser(req.body)
    return sendResponse(res,{
        statusCode:201,
        message:"User created successfully",
        data:user
    })
}

export const loginUser=async(req:Request,res:Response)=>{
    const {refreshToken,...user}=await userServices.loginUser(req.body)
    res.cookie("refreshToken",refreshToken,refreshCookieOptions)
    return sendResponse(res,{
        statusCode:200,
        message:"Login successfull",
        data:user
    })
}

export const logout=async(req:Request,res:Response)=>{
    const refreshToken=req.cookies?.refreshToken;
    await userServices.logoutUser(refreshToken)
    res.clearCookie("refreshToken")
    return sendResponse(res,{
        statusCode:200,
        message:"Logged out successfully"
    })
}

export const refreshAccessToken=async(req:Request,res:Response)=>{
    const refreshtoken=req.cookies?.refreshToken;
    const {refreshToken,...data}=await userServices.refreshAccessToken(refreshtoken)
    res.cookie("refreshToken",refreshToken,refreshCookieOptions);
    return sendResponse(res,{
        statusCode:200,
        data:data
    })
}

export const currentUser=async(req:Request,res:Response)=>{
    const id=req.user!.userId;
    const user=await userServices.currentUser(id)
    return sendResponse(res,{
        statusCode:200,
        data:user
    })
}