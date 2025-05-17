import { Router } from "express";
import {
  createRoom,
  getRoom,
  getRoomChats,
  register,
  signin,
} from "../controllers/user.controllers";
import { isLoggedIn } from "../middlewares/auth.middleware";

const userRouter: Router = Router();

userRouter.post("/signup", register);
userRouter.post("/signin", signin);
userRouter.post("/createRoom", isLoggedIn, createRoom);
userRouter.get("/room/:slug", isLoggedIn, getRoom);
userRouter.get("/chats/:roomId", isLoggedIn, getRoomChats);

export { userRouter };
