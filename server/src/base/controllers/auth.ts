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
import jwt_decode from "jwt-decode";

require("express-async-errors");

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // check for duplicate
  const existingUser = await collections.users?.findOne({ email });
  if (existingUser) {
    throw new HttpError(403, "User already exists");
  }

  // create user
  const user = new User();
  user.name = name;
  user.email = email;
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  const result = await collections.users?.insertOne(user);

  if (result && result.insertedId) {
    req.session.userId = result.insertedId;
    res.status(201).json({ userId: result.insertedId });
  } else {
    throw new HttpError(500, "Could not create account");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // verify user
  const user = await collections.users?.findOne({ email });

  if (!user || !user.password) {
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

export const googleLogin = async (req: Request, res: Response) => {
  const { credential } = req.body;

  const userObject = jwt_decode(credential) as any;
  const email = userObject.email;

  // verify user
  const user = await collections.users?.findOne({ email });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  // verified
  req.session.userId = user._id;
  res.json({ userId: user._id });
};

export const googleRegister = async (req: Request, res: Response) => {
  const { credential } = req.body;

  const userObject = jwt_decode(credential) as any;
  const email = userObject.email;
  const name = userObject.name;

  // check for duplicate
  const existingUser = await collections.users?.findOne({ email });
  if (existingUser) {
    throw new HttpError(403, "User already exists");
  }

  // create user
  const user = new User();
  user.name = name;
  user.email = email;
  const result = await collections.users?.insertOne(user);

  if (result && result.insertedId) {
    req.session.userId = result.insertedId;
    res.status(201).json({ userId: result.insertedId });
  } else {
    throw new HttpError(500, "Could not create account");
  }
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
  const { newEmail } = req.body;

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

  if (!req.user!.password) {
    throw new HttpError(404, "User has no password");
  }

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
