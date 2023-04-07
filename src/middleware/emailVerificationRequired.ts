import { Request, Response, NextFunction } from "express";
import HttpError from "../errors/HttpError";

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new HttpError(401, "Unauthorized");
  }

  if (!req.user.emailVerified) {
    throw new HttpError(403, "Please verify your email first");
  }

  next();
};
