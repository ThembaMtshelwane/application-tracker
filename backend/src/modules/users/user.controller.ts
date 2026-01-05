import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import User from "./user.model.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { HTTP_CODES } from "../../consts/http.consts.js";
import { sendResponse } from "../../utils/http.success.js";
import { paginate } from "../../shared/services/paginate.js";
import { deleteOneDoc } from "../../shared/crudHandler.js";

// ────────────────────────────────────────────────
// GET LOGGIED IN USER
// ────────────────────────────────────────────────
export const profile = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user.id;
  const user = await User.findById(id).select("-password");
  if (!user) throw new HttpError(HTTP_CODES.NOT_FOUND, "User not found");

  sendResponse(res, HTTP_CODES.OK, "Successfully fetched logged in user", user);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const user = await User.findById(id).select("-password");
  if (!user) throw new HttpError(HTTP_CODES.NOT_FOUND, "User not found");

  sendResponse(res, HTTP_CODES.OK, "Successfully feteched user", user);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await paginate(User, req.query, {
    searchFields: ["firstName", "lastName", "email"],
    filterableFields: ["role"],
    selectFields: "-password -access_token_secret -refresh_token_secret",
  });

  sendResponse(res, HTTP_CODES.OK, "Successfully fetched users", users);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    timestamps: true,
  }).select("-access_token_secret -refresh_token_secret");

  if (!updateUser)
    throw new HttpError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to update user"
    );

  sendResponse(res, HTTP_CODES.OK, "Successfully updated the user", updateUser);
});

export const updateUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: false },
      {
        new: true,
        runValidators: true,
        timestamps: true,
      }
    ).select("-access_token_secret -refresh_token_secret");

    if (!updateUser)
      throw new HttpError(
        HTTP_CODES.INTERNAL_SERVER_ERROR,
        "Failed to update user status"
      );

    sendResponse(
      res,
      HTTP_CODES.OK,
      "Successfully updated the user role",
      updateUser
    );
  }
);

export const deleteUser = deleteOneDoc(User);
