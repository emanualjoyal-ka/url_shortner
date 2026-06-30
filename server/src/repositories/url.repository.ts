import prisma from "../config/prisma.js"
import type { CreateClickEventDTO, CreateUrlRepositoryDTO, GetAllUrlsAdminDTO, GetAllUrlsDTO} from "../dtos/url.dto.js"


const urlTable=prisma.url
const clickEventTable=prisma.clickEvent

export const urlRepository={
    createUrl:(data:CreateUrlRepositoryDTO)=>{
        return urlTable.create({data})
    },

    findUrl:(shortCode:string)=>{
        return urlTable.findUnique({where:{short_code:shortCode}})
    },

    recordClick:async(id:string,data:CreateClickEventDTO)=>{
        return prisma.$transaction(async(tx)=>{
            await tx.clickEvent.create({data})
            await tx.url.update({where:{id},data:{clicks:{increment:1}}})
        })
    },

    getAllUrls:({page,limit,userId}:GetAllUrlsDTO)=>{
        const skip=(page-1)*limit;
        return urlTable.findMany({
            skip:skip,
            take:limit,
            where:{
                user_id:userId
            },
            select:{
                original_url:true,
                short_code:true,
                clicks:true,
                created_at:true,
                updated_at:true
            }
        })
    },

    getAllUrlsAdmin:({page,limit}:GetAllUrlsAdminDTO)=>{
        const skip=(page-1)*limit;
        return urlTable.findMany({
            skip:skip,
            take:limit,
            select:{
                original_url:true,
                short_code:true,
                clicks:true,
                created_at:true,
                updated_at:true
            }
        })
    }
}