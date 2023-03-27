import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { collections } from "../../services/database.service";
import User from "../models/User";
import HttpError from "../../errors/HttpError";
import { COOKIE_NAME } from "../../utils/config";
import { PasswordReset } from "../models/PasswordReset";
import { sendEmail } from "../../services/email.service";
import { generatePasswordResetEmail } from "../../utils/emailFactory";

require("express-async-errors");

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  // create user
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = hashedPassword;
  await collections.users?.insertOne(user);

  req.session.userId = user._id!;

  // save into db
  res.status(201).json({ userId: user._id });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // verify user
  const user = await collections.users?.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const verified = await bcrypt.compare(password, user.password);
  if (!verified) {
    throw new HttpError(401, "Invalid credentials");
  }

  // verified
  req.session.userId = user._id;
  res.json({ userId: user._id });
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    res.clearCookie(COOKIE_NAME);
    if (err) {
      console.log("LOGOUT ERROR: ", err);
    }
    res.json();
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  // find user
  const user = await collections.users?.findOne({ email });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  // generate token
  const token = v4();
  const pr = new PasswordReset();
  pr.token = token;
  pr.userId = user._id;
  await collections.passwordReset?.insertOne(pr);

  // send email
  sendEmail(generatePasswordResetEmail(email, token));

  res.json();
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // retrieve user
  const pr = await collections.passwordReset?.findOne({ token: token });
  if (!pr) {
    throw new HttpError(404, "Password reset has expired");
  }

  const userId = pr.userId;
  const user = await collections.users?.findOne({ _id: userId });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  // store new password
  const hashedPassword = await bcrypt.hash(password, 12);
  await collections.users?.updateOne(
    // TODO: UPDATEONE NO LONGER WORKS LIKE THIS, NEED TO USE $SET
    { id: user._id },
    { password: hashedPassword }
  );

  // delete password reset token
  await collections.passwordReset?.deleteOne({ id: pr._id });

  res.json({ message: "success" });
};

export const changeEmail = async (req: Request, res: Response) => {
  const { password, newEmail } = req.body;

  // verify password
  const verified = await bcrypt.compare(password, req.user!.password);
  if (!verified) {
    throw new HttpError(401, "Invalid credentials");
  }

  // replace email
  // TODO: UPDATEONE NO LONGER WORKS LIKE THIS, NEED TO USE $SET
  await collections.users?.updateOne(
    { _id: req.user!._id },
    { email: newEmail }
  );

  res.json({ message: "success" });
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  // verify password
  const verified = await bcrypt.compare(oldPassword, req.user!.password);
  if (!verified) {
    throw new HttpError(401, "Invalid credentials");
  }

  // change password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await collections.users?.updateOne(
    { _id: req.user!._id },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );

  res.json({ message: "success" });
};
