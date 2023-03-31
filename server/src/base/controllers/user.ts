import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../../services/database.service";
import User from "../models/User";
require("express-async-errors");

export const getCurrentUser = async (req: Request, res: Response) => {
  if (req.session.userId) {
    const userDoc = await collections.users!.findOne({
      _id: new ObjectId(req.session.userId),
    });
    if (!userDoc) {
      res.json({ user: null });
      return;
    }

    const user = User.assign(userDoc);
    res.json({
      user,
    });
  } else {
    res.json({ user: null });
  }
};
