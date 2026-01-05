import { Router } from "express";
import {
  getUser,
  getUsers,
  profile,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "./user.controller.js";
import { authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authorize(["admin"]), getUsers);
router.get("/profile", profile);
router.patch("/status/:id", authorize(["admin"]), updateUserStatus);
router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(authorize(["admin"]), deleteUser);

export default router;
