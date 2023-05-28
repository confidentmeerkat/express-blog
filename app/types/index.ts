import type { Router } from "express";

export abstract class BaseController {
  abstract router: Router;
  abstract path: string;

  abstract initializeRoutes: () => void;
}

export type Comment = {
  content: string;
  commenter: string;
};
