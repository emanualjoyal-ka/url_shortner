import type { AdminUrlResponseDTO } from "../dtos/url.dto.js";
import { adminUrlRepository } from "../repositories/admin.url.repository.js";
import ApiError from "../utils/ApiError.js";


export const adminServices={
    getAllUrls:async(user:string,page:number,limit:number):Promise<AdminUrlResponseDTO>=>{
        if(!user){
            throw new ApiError("Unauthorized",409)
        }
        const {urls,totalItems}=await adminUrlRepository.getAllUrlsAdmin({page,limit})
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
    }
}