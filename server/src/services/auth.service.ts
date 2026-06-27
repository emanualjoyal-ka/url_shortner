import type { CreateUserDTO, UserResponseDTO } from "../dtos/user.dto.js";
import { userRepository } from "../repositories/auth.repository.js";



export const userServices={
    createUser:async(data:CreateUserDTO): Promise<UserResponseDTO> =>{
        const user=await userRepository.createUser(data)
        return {
            username:user.username,
            email:user.email
        }
    }
}