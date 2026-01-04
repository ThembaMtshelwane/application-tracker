import { type NextFunction, type Request, type Response } from "express";
import { ERROR_MESSAGES, HTTP_CODES } from "../consts/http.consts.js";
import ENV_VARS from "../consts/env.consts.js";
import { ZodError } from "zod";

export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleZodError = (err: ZodError) => {
  const errors = err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: HTTP_CODES.BAD_REQUEST,
    body: {
      errors,
      message: "Validation Error",
    },
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res
    .status(HTTP_CODES.NOT_FOUND)
    .json({ message: `Not Found - ${req.originalUrl}` });
};

export const errorHandler = (
  err: unknown | HttpError | ZodError,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      stack: ENV_VARS.NODE_ENV === "production" ? undefined : err.stack,
    });
  }

  if (err instanceof ZodError) {
    const { statusCode, body } = handleZodError(err);
    return res.status(statusCode).json(body);
  }

  return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    stack:
      ENV_VARS.NODE_ENV === "production"
        ? null
        : typeof err === "object" && err !== null && "stack" in err
        ? (err as Error).stack
        : undefined,
  });
};
