import type { Request, Response } from "express";
import { userServices } from "../services/auth.service.js";


export const createUser=async(req:Request,res:Response)=>{
    const user=await userServices.createUser(req.body)
    res.status(201).json({success:true,message:"User created Successfully",data:user})
}