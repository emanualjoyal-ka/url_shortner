import prisma from "../config/prisma.js"
import type { GetAllUrlsAdminDTO } from "../dtos/url.dto.js";

const urlTable=prisma.url
const clickEventTable=prisma.clickEvent

export const adminUrlRepository={
    getAllUrlsAdmin:async({page,limit}:GetAllUrlsAdminDTO)=>{
        const skip=(page-1)*limit;
        const [urls,totalItems]=await Promise.all([
            urlTable.findMany({
            skip:skip,
            take:limit,
            select:{
                original_url:true,
                short_code:true,
                clicks:true,
                created_at:true,
                updated_at:true,
                expires_at:true,
                is_active:true,
                user:{
                    select:{
                        username:true
                    }
                }
            },
            orderBy:{
                created_at:"desc"
            }
        }),
        urlTable.count()
        ])
        return {
            urls,
            totalItems
        }
    },
}