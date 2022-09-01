import { Request, Response } from "express";
import { DI } from "../..";
require("express-async-errors");

export const getCurrentUser = async (req: Request, res: Response) => {
  if (req.session.userId) {
    const user = await DI.userRepository.findOne(req.session.userId);
    if (!user) {
      res.json({ user: null });
      return;
    }
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.json({ user: null });
  }
};
