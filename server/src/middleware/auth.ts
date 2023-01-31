import { Request, Response, NextFunction } from "express";

import HttpError from "../errors/HttpError";
import { collections } from "../services/database.service";
import { ObjectId } from "mongodb";
import User from "../base/models/User";

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    throw new HttpError(401, "Unauthorized");
  }

  const sessionUser = await collections.users?.findOne({
    _id: new ObjectId(req.session.userId),
  });
  if (!sessionUser) {
    throw new HttpError(401, "Unauthorized");
  }

  req.user = User.assign(sessionUser);

  next();
};
