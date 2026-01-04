import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import User from "./user.model.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { HTTP_CODES } from "../../consts/http.consts.js";
import { sendResponse } from "../../utils/http.success.js";

// ────────────────────────────────────────────────
// GET LOGGIED IN USER
// ────────────────────────────────────────────────
export const profile = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user.id;
  const user = await User.findById(id);
  if (!user) throw new HttpError(HTTP_CODES.NOT_FOUND, "User not found");

  sendResponse(res, HTTP_CODES.OK, "Logged in user successfully fetched");
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const user = await User.findById(id).select("-password");
  if (!user) throw new HttpError(HTTP_CODES.NOT_FOUND, "User not found");

  sendResponse(res, HTTP_CODES.OK, "Successfully feteched user", user);
});
