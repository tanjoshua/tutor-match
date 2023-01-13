import { Request, Response, NextFunction } from "express";

import { DI } from "../index";
import HttpError from "../errors/HttpError";
import { collections } from "../services/database.service";
import { ObjectId } from "mongodb";
import User from "../base/models/User";

export default async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    throw new HttpError(401, "Unauthorized");
  }

  // TODO: to remove once fully migrated over to native mongodb driver
  const user = await DI.userRepository.findOne(req.session.userId);
  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }
  req.user = user;

  const sessionUser = await collections.users?.findOne({
    _id: new ObjectId(req.session.userId),
  });
  if (!sessionUser) {
    throw new HttpError(401, "Unauthorized");
  }

  req.sessionUser = User.assign(sessionUser);

  next();
};
