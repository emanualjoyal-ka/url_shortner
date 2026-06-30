import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

interface JwtPayload {
  userId: string;
  token_id:string;
  role:string
}

export const generateAccessToken =
  (payload: JwtPayload) => {
    return jwt.sign(
      payload,
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m"
      }
    );
  };  

export const generateRefreshToken =
  (payload: JwtPayload) => {
    return jwt.sign(
      payload,
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d"
      }
    );
  };

export const verifyAccessToken =
  (token: string) => {
    return jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    ) as JwtPayload;
  };

export const verifyRefreshToken =
  (token: string) => {
    return jwt.verify(
      token,
      env.REFRESH_TOKEN_SECRET
    ) as JwtPayload;
  };