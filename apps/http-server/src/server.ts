import app from "./app";
import { connectToDB } from "./configs/db";
import { config } from "dotenv";
config();

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

app.listen(PORT, () => {
  console.log(PORT);
  connectToDB();
  console.log(`App is live at http://${HOSTNAME}:${PORT}`);
});
