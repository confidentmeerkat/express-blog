import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseController } from "../types";
import User from "../models/User";

export default class AuthController extends BaseController {
  public path = "/auth";
  public router = express.Router();

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post("/login", this.login);
    this.router.post("/register", this.register);
  };

  public async register(req: Request, res: Response) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const hashed = await bcrypt.hash(password, 10);

      await User.create({ ...req.body, password: hashed });

      return res.json("success");
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const snapShot = await User.collection.where("email", "==", email).get();

      const [user] = snapShot.docs;
      if (!user) {
        return res.status(400).send({ message: "User does not exist" });
      }

      const userData = user.data();

      if (!bcrypt.compareSync(password, userData.password)) {
        return res.status(400).send({ message: "Password incorrect" });
      }

      const token = await jwt.sign({ id: user.id }, process.env.SECRET || "secret");

      return res.json({ token });
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }
}
