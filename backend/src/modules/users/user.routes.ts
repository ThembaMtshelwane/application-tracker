import { Router } from "express";
import { getUser, getUsers, profile, updateUser } from "./user.controller.js";

const router = Router();

router.get("/profile", profile);
router.get("/", getUsers);
router.route("/:id").get(getUser).patch(updateUser);

export default router;
