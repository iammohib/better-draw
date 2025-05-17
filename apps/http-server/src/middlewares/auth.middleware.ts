import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.utils";
import JWT from "jsonwebtoken";
import { JWT_SECRET } from "@repo/server-common/config";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new AppError(400, "Unauthenticated!"));
    }

    const userData = await JWT.verify(token, JWT_SECRET);
    if (!userData) {
      return next(new AppError(400, "Unauthenticated!"));
    }
    //@ts-ignore
    req.user = userData;
    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return next(new AppError(500, message));
  }
};
