import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import User from "../users/user.model.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { HTTP_CODES } from "../../consts/http.consts.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import {
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from "../../utils/cookie.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new HttpError(HTTP_CODES.BAD_REQUEST, "Email already in use");

  // 2. Hash Password (never store plain text)
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create User
  const user = await User.create({ email, password: hashedPassword });

  if (!user)
    throw new HttpError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Registration failed"
    );

  res
    .status(HTTP_CODES.CREATED)
    .json({ message: "User registered successfully" });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(HTTP_CODES.BAD_REQUEST, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set Cookie for Refresh Token and  Access Token in JSON
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);

  res.status(HTTP_CODES.OK).json({
    message: "Successfully logged in",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});
