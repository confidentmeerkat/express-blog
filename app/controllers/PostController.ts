import express, { Response, Request } from "express";
import { BaseController } from "../types";
import Post from "../models/Post";

export default class PostController extends BaseController {
  public path = "/posts";
  public router = express.Router();

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.get("/", this.get);
    this.router.post("/", this.create);
  };

  public async get(req: Request, res: Response) {
    try {
      const posts = await Post.find();

      return res.json(posts || []);
    } catch (e) {
      console.log(e);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const post = await Post.create(req.body);

      return res.json(post);
    } catch (e) {
      console.log(e);
    }
  }
}
