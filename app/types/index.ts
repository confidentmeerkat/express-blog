import type { Router } from "express";

export abstract class BaseController {
  abstract router: Router;

  abstract initializeRoutes: () => void;
}
