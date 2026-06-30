import type { AdminUrlResponseDTO } from "../dtos/url.dto.js";
import { urlRepository } from "../repositories/url.repository.js";
import ApiError from "../utils/ApiError.js";



export const adminServices={
    getAllUrls:async(user:string,page:number,limit:number):Promise<AdminUrlResponseDTO[]>=>{
        if(!user){
            throw new ApiError("Unauthorized",409)
        }
        const data=await urlRepository.getAllUrlsAdmin({page,limit})
        return data;
    }
}