import type { Model } from "mongoose";
import asyncHandler from "express-async-handler";
import { type Request, type Response, type NextFunction } from "express";
import { HttpError } from "../middleware/error.middleware.js";
import { HTTP_CODES } from "../consts/http.consts.js";
import { sendResponse } from "../utils/http.success.js";

export const deleteOneDoc = <T>(Model: Model<T>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      throw new HttpError(
        HTTP_CODES.NOT_FOUND,
        `No ${Model.modelName} found with that ID`
      );
    }
    sendResponse(res, HTTP_CODES.OK, `${Model.modelName} deleted successfully`);
  });
