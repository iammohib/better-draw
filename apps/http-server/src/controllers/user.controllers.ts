import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/error.utils";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/types/types";
import { prismaClient } from "@repo/db/client";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SECRET } from "@repo/server-common/config";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = CreateUserSchema.parse(req.body);
    const { username, email, password } = parsedData;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new Error("User registration failed.");
    }

    res.json({
      success: true,
      message: "User registered successfullly",
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return next(new AppError(500, message));
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = SigninSchema.parse(req.body);
    const { username, password } = parsedData;

    const user = await prismaClient.user.findFirst({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error("User not found with this credentials.");
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user?.password);
    if (!isPasswordCorrect) throw new Error("Invalid password.");

    const payload = {
      username: user.username,
      email: user.email,
      id: user.id,
    };
    const token = await JWT.sign(payload, JWT_SECRET);

    res.cookie("token", token, { httpOnly: true, secure: false });
    res.json({
      success: true,
      message: "User logged in successfullly",
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return next(new AppError(500, message));
  }
};

export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = await CreateRoomSchema.parse(req.body);
    const { name } = parsedData;

    // @ts-ignore
    const user = await req.user;

    const room = await prismaClient.room.create({
      data: {
        slug: name,
        adminId: user.id,
      },
    });

    if (!room) throw new Error("Failed to create room.");

    res.json({
      success: true,
      message: "Room created successfullly",
      room,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return next(new AppError(500, message));
  }
};

export const getRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    if (!slug) throw new Error("Room name needed!");

    const room = await prismaClient.room.findFirst({
      where: {
        slug,
      },
    });

    if (!room) throw new Error("Failed to create room.");

    res.json({
      success: true,
      message: "Room fetched successfullly",
      room,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return next(new AppError(500, message));
  }
};

export const getRoomChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = Number(req.params.roomId);
    if (!roomId) throw new Error("Room ID needed!");

    const chats = await prismaClient.chat.findMany({
      where: {
        roomId,
      },
    });

    if (!chats) throw new Error("Failed to get chats.");

    res.json({
      success: true,
      message: "Chats fecthed successfullly",
      chats,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return next(new AppError(500, message));
  }
};
