import { Router } from "express";
import { getAllUrls } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/authenticate.middleware.js";
import { authorize } from "../middleware/authorization.middleware.js";

const router=Router()


router.get("/urls",authenticate,authorize("ADMIN"),getAllUrls);


export default router;