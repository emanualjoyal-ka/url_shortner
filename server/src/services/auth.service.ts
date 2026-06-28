import type { CreateUserDTO, UserResponseDTO } from "../dtos/user.dto.js";
import { userRepository } from "../repositories/auth.repository.js";
import ApiError from "../utils/ApiError.js";



export const userServices={
    createUser:async(data:CreateUserDTO): Promise<UserResponseDTO> =>{

        const existingUser=await userRepository.findByEmail(data.email)

        if(existingUser){
            throw new ApiError("Email already exists",409)
        }

        const user=await userRepository.createUser(data)
        return {
            username:user.username,
            email:user.email
        }
    }
}