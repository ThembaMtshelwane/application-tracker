import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getUser, getUsers, profile } from "./user.controller.js";

const router = Router();

router.get("/profile", authenticate, profile);
router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
