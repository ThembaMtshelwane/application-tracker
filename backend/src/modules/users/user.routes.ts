import { Router } from "express";
import { getUser, getUsers, profile, updateUser, deleteUser } from "./user.controller.js";

const router = Router();

router.get("/profile", profile);
router.get("/", getUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
