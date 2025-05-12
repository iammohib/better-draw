import express from "express";
import { prismaClient } from "@repo/db/client";

const app = express();

app.get("/", async (req, res) => {
  // db test purpose
  // const user = await prismaClient.user.findMany();
  // console.log(user);
  res.send("Homepage");
});

app.listen(8080, () => {
  console.log(`App is live at http://localhost:8080`);
});
