import { Router } from "express";
import { updateUrlSchema, urlSchema } from "../validations/url.validation.js";
import {
  createUrl,
  deleteUrl,
  getAllUrls,
  redirectUrl,
  updateUrl,
} from "../controllers/url.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authenticate } from "../middleware/authenticate.middleware.js";

const router = Router();

router.post("/create", authenticate, validate(urlSchema), createUrl);
router.get("/:shortCode", redirectUrl);
router.get("/", authenticate, getAllUrls);
router.delete("/del/:shortCode",authenticate,deleteUrl);
router.patch("/:shortCode",authenticate,validate(updateUrlSchema),updateUrl);

export default router;
