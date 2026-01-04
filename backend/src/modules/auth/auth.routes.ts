import { Router } from "express";
import {
  login,
  logout,
  refresh,
  register,
  profile,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

router.get("/profile", authenticate, profile);

router.post("/logout", logout);

export default router;
