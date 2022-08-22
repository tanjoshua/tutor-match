import { Request, Response, NextFunction } from "express";

import { DI } from "../index";
import HttpError from "../errors/HttpError";

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    throw new HttpError(401, "Unauthorized");
  }

  const user = await DI.userRepository.findOne(req.session.userId);
  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }

  req.user = user;

  next();
};
