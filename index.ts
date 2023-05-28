import App from "./app";
import dotenv from "dotenv";
import UserController from "./app/controllers/UserController";

dotenv.config();

const port = parseInt(process.env.PORT || "3000");

const app = new App([new UserController()], port);

app.start();
