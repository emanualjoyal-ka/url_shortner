import { Router } from "express";
import { urlSchema } from "../validations/url.validation.js";
import {
  createUrl,
  getAllUrls,
  redirectUrl,
} from "../controllers/url.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { authorize } from "../middleware/authorization.middleware.js";

const router = Router();

router.post("/create", authenticate, validate(urlSchema), createUrl);
router.get("/redirect/:shortCode", redirectUrl);
router.get("/", authenticate, getAllUrls);

export default router;
