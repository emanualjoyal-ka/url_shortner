export type CreateUserDTO={
    email:string;
    username:string;
    password:string;
}
export type UserResponseDTO={
    email:string;
    username:string
}

export type LoginUserDTO={
    email:string;
    password:string;
}

export type LoginResponseDTO ={
    email:string;
    username:string;
    accessToken:string;
}

export type RefreshTokenResponseDTO ={
    email:string;
    username:string;
    accessToken:string;
}

export type RefreshTokenCreateDTO={
    user_id:string;
    token_hash:string;
    expires_at:Date;
    token_id:string;
}

