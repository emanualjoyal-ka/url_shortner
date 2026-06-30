import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import { userRepository } from "../repositories/auth.repository.js";

declare global { // we modify the expresse's Request by adding user property
  namespace Express {   // namespace Express is express's way, which contains things like params,query,body etc and now we add user property in to it.
    interface Request {
      user?: {
        userId: string;
        token_id: string;
        role:string
      };
    }
  }
}

export const authenticate = async (req: Request,_res: Response,next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    throw new ApiError("Access token is required", 401);
  }
  const token = authHeader.split(" ")[1];
  if(!token){
    throw new ApiError("Access token is required",401);
  }
  const payload = verifyAccessToken(token);
  const session = await userRepository.findByTokenId(payload.token_id);
  if (!session || session.is_revoked || session.expires_at < new Date()) {
    throw new ApiError("Session expired", 401);
  }
  req.user = {
    userId: payload.userId,
    token_id: payload.token_id,
    role:payload.role
  };
  next();
};