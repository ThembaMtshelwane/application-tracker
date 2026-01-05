import { Router } from "express";
import {
  getUser,
  getUsers,
  profile,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/profile", profile);
router.get("/", authorize(["admin"]), getUsers);
router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(authorize(["admin"]), deleteUser);

export default router;
