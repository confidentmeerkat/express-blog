import App from "./app";
import dotenv from "dotenv";
import UserController from "./app/controllers/UserController";
import PostController from "./app/controllers/PostController";
import AuthController from "./app/controllers/AuthController";

dotenv.config();

const port = parseInt(process.env.PORT || "3000");

const app = new App([new UserController(), new PostController(), new AuthController()], port);

app.start();
