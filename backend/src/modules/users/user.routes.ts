import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getUser, profile } from "./user.controller.js";

const router = Router();

router.get("/profile", authenticate, profile);

router.get("/:id", getUser);

export default router;
