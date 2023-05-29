import express, { Response, Request } from "express";
import { BaseController } from "../types";
import User from "../models/User";

export default class UserController extends BaseController {
  public path = "/users";
  public router = express.Router();

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.get("/", this.get);
    this.router.get("/:id", this.getById);
  };

  public async get(req: Request, res: Response) {
    try {
      const users = await User.find();

      return res.json(users || []);
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await User.findById(id);

      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }
}
