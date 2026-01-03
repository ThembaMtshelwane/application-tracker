import asyncHandler from "express-async-handler";
import { ZodObject, type ZodRawShape } from "zod";
import { type Request } from "express";

export const validate = (schema: ZodObject<ZodRawShape>) =>
  asyncHandler(async (req: Request, _, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.params,
    });

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data.body;

    next();
  });
