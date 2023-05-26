import express, { Express } from "express";
import { BaseController } from "./types";

export default class App {
  private app: Express;
  public port: number;

  constructor(controllers: BaseController[], port: number) {
    this.app = express();
    this.initializeControllers(controllers);
    this.port = port;
  }

  private initializeControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`App is listening on port ${this.port}`);
    });
  }
}
