import type { CreateUserDTO, LoginResponseDTO, LoginUserDTO, RefreshTokenResponseDTO, UserResponseDTO } from "../dtos/user.dto.js";
import { userRepository } from "../repositories/auth.repository.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { v4 as uuidv4 } from "uuid";


export const userServices={
    createUser:async(data:CreateUserDTO): Promise<UserResponseDTO> =>{
        const existingUser=await userRepository.findByEmail(data.email)
        if(existingUser){
            throw new ApiError("Email already exists",409)
        }
        const hashedPasswd=await bcrypt.hash(data.password,10)
        const userData={
            ...data,
            password:hashedPasswd
        }
        const user=await userRepository.createUser(userData)
        return {
            username:user.username,
            email:user.email
        }
    },

    loginUser:async(data:LoginUserDTO):Promise<LoginResponseDTO & { refreshToken: string }>=>{
        const user=await userRepository.findByEmail(data.email)
        if(!user){
            throw new ApiError("Invalid Credentials",404)
        }
        const is_passwd=await bcrypt.compare(data.password,user.password)
        if(!is_passwd){
            throw new ApiError("Invalid password",404)
        }
        const token_Id=uuidv4()
        const accessToken=generateAccessToken({userId:user.id.toString(),token_id:token_Id,role:user.role})
        const refreshToken=generateRefreshToken({userId:user.id.toString(),token_id:token_Id,role:user.role})
        const hashedRefreshToken=await bcrypt.hash(refreshToken,10)

        await userRepository.createRefreshToken({
            user_id:user.id,
            token_hash:hashedRefreshToken,
            token_id:token_Id,
            expires_at:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        })

        return{
            username:user.username,
            email:user.email,
            accessToken:accessToken,
            refreshToken:refreshToken
        }
    },

    logoutUser:async(token?:string):Promise<void>=>{
        if(!token){
            throw new ApiError("No refresh token provided",400)
        }
        const payload=verifyRefreshToken(token);
        const updated=await userRepository.revokeToken(payload.token_id)
        if(!updated){
            throw new ApiError("Session not found",404)
        }
    },

    refreshAccessToken:async(token?:string):Promise<RefreshTokenResponseDTO & {refreshToken:string}>=>{ 
        if(!token){
            throw new ApiError("No refresh token provided",401)
        }
        const payload=verifyRefreshToken(token);
        const user=await userRepository.findById(payload.userId)
        if(!user){
            throw new ApiError("User not found",403);
        }
        const tokenRecord=await userRepository.findByTokenId(payload.token_id)
        if(!tokenRecord ||tokenRecord.is_revoked || tokenRecord.expires_at < new Date()){
            throw new ApiError("Session has expired or has been revoked",401)
        }
        const is_token=await bcrypt.compare(token,tokenRecord.token_hash)
        if(!is_token){
            throw new ApiError("Invalid refresh token",401)
        }
        const newTokenId=uuidv4()
        const newAccessToken=generateAccessToken({userId:user.id.toString(),token_id:newTokenId,role:user.role})
        const newRefreshToken=generateRefreshToken({userId:user.id.toString(),token_id:newTokenId,role:user.role});
        const hashedRefreshToken=await bcrypt.hash(newRefreshToken,10);
        await userRepository.rotateRefreshToken(payload.token_id,{
            user_id:user.id,
            token_hash:hashedRefreshToken,
            token_id:newTokenId,
            expires_at:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        })
        return {
            accessToken:newAccessToken,
            refreshToken:newRefreshToken,
            email:user.email,
            username:user.username
        }
    },

    currentUser:async(userId:string):Promise<UserResponseDTO>=>{
        const user=await userRepository.findById(userId)
        if(!user){
            throw new ApiError("user not found",404)
        }
        return {
            username:user.username,
            email:user.email
        }
    }
}