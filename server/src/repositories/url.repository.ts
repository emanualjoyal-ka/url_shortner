import prisma from "../config/prisma.js"
import type { CreateClickEventDTO, CreateUrlRepositoryDTO, GetAllUrlsDTO, UpdateUrlDTO} from "../dtos/url.dto.js"


const urlTable=prisma.url

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

    getAllUrls:async({page,limit,userId}:GetAllUrlsDTO)=>{
        const skip=(page-1)*limit;
        const [urls,totalItems]=await Promise.all([
            urlTable.findMany({
            skip:skip,
            take:limit,
            where:{
                user_id:userId,
                deleted_at:null
            },
            select:{
                original_url:true,
                short_code:true,
                clicks:true,
                created_at:true,
                updated_at:true,
                expires_at:true,
                is_active:true
            },
            orderBy:{
                created_at:"desc"
            }
        }),
        urlTable.count({
            where:{
                user_id:userId,
                deleted_at:null
            }
        })
        
        ])
        return{
            urls,
            totalItems
        }
    },

    deleteUrl:(shortCode:string,userId:string)=>{
        return urlTable.updateMany({
            where:{
                short_code:shortCode,
                user_id:userId,
                deleted_at:null
            },
            data:{
                deleted_at:new Date()
            }
        })
    },

    updateUrl:(shortCode:string,userId:string,data:UpdateUrlDTO)=>{
        return urlTable.updateMany({
            where:{
                short_code:shortCode,
                user_id:userId
            },
            data
        })
    }
}