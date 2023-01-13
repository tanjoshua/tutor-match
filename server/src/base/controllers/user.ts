import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../../services/database.service";
require("express-async-errors");

export const getCurrentUser = async (req: Request, res: Response) => {
  if (req.session.userId) {
    const user = await collections.users!.findOne({
      _id: new ObjectId(req.session.userId),
    });
    if (!user) {
      res.json({ user: null });
      return;
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.json({ user: null });
  }
};
