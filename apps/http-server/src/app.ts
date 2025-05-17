import express, { Express, json } from "express";
import cors from "cors";
import { userRouter } from "./routes/user.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// server status check route
app.get("/ping", (req, res) => {
  res.send("pong");
});

// import all routes
app.use("/api/v1/user", userRouter);

// default catch all routes
app.all(/.*/, (req, res, next) => {
  res.status(404).send("404 page not found");
});

// custome error handling middleware
app.use(errorMiddleware);

export default app;
