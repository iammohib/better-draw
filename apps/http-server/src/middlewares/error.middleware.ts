import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.utils";

// Centralized error-handling middleware
export const errorMiddleware: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // If the error wasn't created by our AppError, convert it
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const stack = process.env.NODE_ENV === "production" ? undefined : err.stack;

  res.status(statusCode).json({
    success: false,
    message,
    ...(stack && { stack }),
  });
};
