import { NextFunction, Response } from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";

const jwtAuth = [
  expressjwt({ secret: process.env.SECRET || "secret", algorithms: ["HS256"] }),
  function (req: JWTRequest, res: Response, next: NextFunction) {
    if (!req?.auth?.id) return res.sendStatus(401);

    next();
  },
];

export default jwtAuth;
