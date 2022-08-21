import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { wrap } from "@mikro-orm/core";
import { v4 } from "uuid";

import { User } from "../entities/User";
import { createToken } from "../../utils/tokenService";
import HttpError from "../../errors/HttpError";
import { DI } from "../..";
import { COOKIE_NAME } from "../../utils/config";
import { sendEmail } from "../../utils/emailService";

require("express-async-errors");

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  // create user
  const user = new User();
  wrap(user).assign({ name, email, password: hashedPassword });
  await DI.userRepository.persistAndFlush(user);

  req.session.userId = user.id;
  const token = createToken({ userId: user.id, name: user.name });

  // save into db
  res.status(201).json({ userId: user.id, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // verify user
  const user = await DI.userRepository.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const verified = await bcrypt.compare(password, user.password);
  if (!verified) {
    throw new HttpError(401, "Invalid credentials");
  }

  // verified
  req.session.userId = user.id;
  const token = createToken({ userId: user.id, name: user.name });
  res.json({ userId: user.id, token });
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
  const user = await DI.userRepository.findOne({ email });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  // generate token
  const token = v4();
  const pr = await DI.passwordResetRepository.create({
    token,
    userId: user.id,
  });
  await DI.passwordResetRepository.persistAndFlush(pr);

  // send email
  const html = `<a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`;
  await sendEmail(email, "Reset Password", html);
  res.json();
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  // retrieve user
  const pr = await DI.passwordResetRepository.findOne(token);
  if (!pr) {
    throw new HttpError(404, "Password reset has expired");
  }

  const userId = pr.userId;
  const user = await DI.userRepository.findOne(userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  // store new password
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  await DI.userRepository.flush();

  // delete password reset token
  await DI.passwordResetRepository.removeAndFlush(pr);

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
  req.user!.email = newEmail;
  await DI.userRepository.flush();

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
  req.user!.password = hashedPassword;
  await DI.userRepository.flush();

  res.json({ message: "success" });
};
