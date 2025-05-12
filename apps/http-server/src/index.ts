import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.listen(8080, () => {
  console.log(`App is live at http://localhost:8080`);
});
