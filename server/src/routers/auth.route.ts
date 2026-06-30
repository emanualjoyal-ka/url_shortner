import { Router } from "express";
import {
  createUser,
  currentUser,
  loginUser,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), createUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticate, currentUser);

export default router;
