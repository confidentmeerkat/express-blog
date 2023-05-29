import express, { Response, Request } from "express";
import { Request as JWTRequest } from "express-jwt";
import jwtAuth from "../middlewares.ts/jwtAuth";
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
    this.router.post("/", jwtAuth, this.create);
    this.router.get("/:id", this.getById);
    this.router.put("/:id", jwtAuth, this.update);
    this.router.post("/:id/comment", jwtAuth, this.comment);
    this.router.post("/:id/like", jwtAuth, this.like);
  };

  public async get(req: Request, res: Response) {
    try {
      const posts = await Post.find();

      return res.json(posts || []);
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }

  public async create(req: JWTRequest, res: Response) {
    try {
      const { title, content, coAuthors }: { title: string; content: string; coAuthors: string[] } = req.body;

      if (!title && title.trim() && content && content.trim()) {
        return res.status(400).json({ message: "Title and Content is required." });
      }

      const userId = req!.auth!.id;
      const post = await Post.create({ title, content, author: userId, views: 0, likes: [] });

      return res.json(post);
    } catch (e) {
      console.log(e);
      return res.status(500);
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
      return res.status(500);
    }
  }

  public async update(req: JWTRequest, res: Response) {
    try {
      const id = req.params.id;

      const post = await Post.findById(id);
      const { views, likes, ...updates } = req.body;

      if (post?.author !== req.auth!.id) {
        return res.status(403);
      }

      await Post.update(req.params.id, updates);

      return res.json("success");
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }

  public async comment(req: JWTRequest, res: Response) {
    try {
      const id = req.params.id;
      const user = req!.auth!.id;

      await Post.addComment(id, { ...req.body, commenter: user });

      return res.json("success");
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }

  public async like(req: JWTRequest, res: Response) {
    try {
      const id = req.params.id;
      const post = await Post.findById(id);
      const user = req.auth!.id;

      if (post?.likes.includes(user)) {
        await Post.update(id, { likes: post.likes.filter((liked) => liked === user) });
      }
      await Post.update(id, { likes: [...(post?.likes || []), user] });

      return res.json("success");
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  }
}
