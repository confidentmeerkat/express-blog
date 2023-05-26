import App from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = parseInt(process.env.PORT || "3000");

const app = new App([], port);

app.start();
