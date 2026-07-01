import { nanoid } from "nanoid";
import type { AdminUrlResponseDTO, CreateUrlDTO, UpdateUrlDTO, UrlResponseDTO } from "../dtos/url.dto.js";
import { urlRepository } from "../repositories/url.repository.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { UAParser } from "ua-parser-js";
import type { Request } from "express";


export const urlServices={
    createUrl:async(data:CreateUrlDTO,userId:string):Promise<UrlResponseDTO>=>{
        if(!userId){
            throw new ApiError("User id needed",409)
        }
        const shortCode=nanoid(8)
        const created=await urlRepository.createUrl({...data,user_id:userId,short_code:shortCode})
        return {
            short_code:created.short_code,
            short_url:`${env.CLIENT_URL}/${created.short_code}`,
            original_url:created.original_url,
            ...(created.expires_at ? { expires_at: created.expires_at } : {})
        }
    },

    redirectUrl:async(shortCode:unknown,req:Request):Promise<string>=>{  
        if (typeof shortCode !== "string" || !shortCode) {
            throw new ApiError("Invalid short code", 400);
        }
        const url=await urlRepository.findUrl(shortCode);
        if(!url || url.deleted_at){
            throw new ApiError("URL not found or inactive",404)
        }
        if(!url.is_active ){
            throw new ApiError("This link has been diasbled",403)
        }
        if (url.expires_at && url.expires_at < new Date()) {
            throw new ApiError("This link has expired.", 410);
        }
        const parser=new UAParser(req.headers["user-agent"]);
        const result=parser.getResult();
        await urlRepository.recordClick(url.id,{
            url_id:url.id,
            clicked_at:new Date(),
            ip_address:req.ip ?? null,
            browser:result.browser.name ?? null,
            operating_system:result.os.name ?? null,
            device_type:result.device.type ?? null,
            user_agent:req.get("User-Agent") ?? null,
            referrer:req.get("Referer") ?? null
        })
        return url.original_url
    },

    getAllUrls:async(userId:string,page:number,limit:number):Promise<AdminUrlResponseDTO>=>{
        if(!userId){
            throw new ApiError("Unauthorized",409)
        }
        const { urls, totalItems }=await urlRepository.getAllUrls({page,limit,userId})
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data:urls,
            pagination:{
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    },

    deleteUrl:async(shortCode:unknown,userId:string):Promise<void>=>{
        if (typeof shortCode !== "string" || !shortCode) {
            throw new ApiError("Invalid short code", 400);
        }
        if(!userId){
            throw new ApiError("Unauthorized",409)
        }
        const result=await urlRepository.deleteUrl(shortCode,userId);
        if (result.count === 0) {
        throw new ApiError("URL not found", 404);
        }
    },

    updateUrl:async(shortCode:unknown,userId:string,data:UpdateUrlDTO):Promise<void>=>{
        if (typeof shortCode !== "string" || !shortCode) {
            throw new ApiError("Invalid short code", 400);
        }
        if(!userId){
            throw new ApiError("Unauthorized",409)
        }
        const result=await urlRepository.updateUrl(shortCode,userId,data);
         if (result.count === 0) {
        throw new ApiError("URL not found", 404);
        }
    }



}