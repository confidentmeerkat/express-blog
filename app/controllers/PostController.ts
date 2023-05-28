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
    this.router.get("/:id", this.getById);
    this.router.put("/:id", this.update);
    this.router.post("/:id/comment", this.comment);
    this.router.post("/:id/like", this.like);
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

  public async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const post = await Post.findById(id);
      await Post.update(id, { views: (post?.views || 0) + 1 });

      return res.json(post);
    } catch (e) {
      console.log(e);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      await Post.update(req.params.id, req.body);

      return res.json("success");
    } catch (e) {
      console.log(e);
    }
  }

  public async comment(req: Request, res: Response) {
    try {
      const id = req.params.id;

      await Post.addComment(id, req.body);

      return res.json("success");
    } catch (e) {
      console.log(e);
    }
  }

  public async like(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const post = await Post.findById(id);
      const user = req.body.user;

      if (post?.likes.includes(user)) {
        await Post.update(id, { likes: post.likes.filter((liked) => liked === user) });
      }
      await Post.update(id, { likes: [...(post?.likes || []), user] });

      return res.json("success");
    } catch (e) {
      console.log(e);
    }
  }
}
