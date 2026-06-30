import prisma from "../config/prisma.js"
import type { CreateUserDTO, RefreshTokenCreateDTO } from "../dtos/user.dto.js";

const userTable=prisma.user
const refreshTokenTable=prisma.refreshToken

export const userRepository={
    createUser:(data:CreateUserDTO)=>{
        return userTable.create({data})
    },

    findByEmail: (email: string) => {
        return userTable.findUnique({ where: { email } });
    },

    findById:(id:string)=>{
        return userTable.findUnique({where:{id}})
    },

    createRefreshToken:(data:RefreshTokenCreateDTO)=>{
        return refreshTokenTable.create({data})
    },

    revokeToken:(tokenId:string)=>{
        return refreshTokenTable.update({
            where:{token_id:tokenId},
            data:{is_revoked:true}
        })
    },

    findByTokenId:(tokenId:string)=>{
        return refreshTokenTable.findUnique({where:{token_id:tokenId}})
    },

    rotateRefreshToken:async(tokenId:string,data:RefreshTokenCreateDTO)=>{
        return prisma.$transaction(async(tx)=>{
            await tx.refreshToken.update({
                where:{token_id:tokenId},
                data:{is_revoked:true}
            })
            await tx.refreshToken.create({data})
        })
    }
}