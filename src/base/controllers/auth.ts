import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { collections } from "../../services/database.service";
import User from "../models/User";
import HttpError from "../../errors/HttpError";
import { COOKIE_NAME } from "../../utils/config";
import { PasswordReset } from "../models/PasswordReset";
import { sendEmail } from "../../services/email.service";
import {
  generateEmailVerificationEmail,
  generatePasswordResetEmail,
} from "../../utils/emailFactory";
import jwt_decode from "jwt-decode";
import { ObjectId } from "mongodb";
import uniqid from "uniqid";
import EmailVerification from "../models/EmailVerification";

require("express-async-errors");

export const register = async (req: Request, res: Response) => {
  const { name, email, password, tutor } = req.body;

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
  user.isTutor = !!tutor;
  const result = await collections.users?.insertOne(user);

  if (result && result.insertedId) {
    req.session.userId = result.insertedId;
    res.status(201).json({ userId: result.insertedId });
  } else {
    throw new HttpError(500, "Could not create account");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, tutor } = req.body;

  // verify user
  const user = await collections.users?.findOne({ email });

  if (!user || !user.password) {
    throw new HttpError(401, "Invalid credentials");
  }

  const verified = await bcrypt.compare(password, user.password);
  if (!verified) {
    throw new HttpError(401, "Invalid credentials");
  }

  if (tutor && !user.isTutor) {
    throw new HttpError(401, "Wrong account type");
  }

  // verified
  req.session.userId = user._id;
  res.json({ userId: user._id });
};

export const googleLogin = async (req: Request, res: Response) => {
  const { credential, tutor } = req.body;

  const userObject = jwt_decode(credential) as any;
  const email = userObject.email;
  const name = userObject.name;

  let message = "Logged in";
  // verify user
  const user = await collections.users?.findOne({ email });
  let userId: ObjectId;
  if (!user) {
    // if user not found, create account for user
    const user = new User();
    user.name = name;
    user.email = email;
    user.emailVerified = true;
    user.isTutor = tutor;
    const result = await collections.users?.insertOne(user);
    if (result && result.insertedId) {
      userId = result.insertedId;
    } else {
      throw new HttpError(500, "Could not create account");
    }
    message = "Account created";
  } else {
    if (tutor && !user.isTutor) {
      throw new HttpError(401, "Wrong account type");
    }

    userId = user._id;
    if (!user.emailVerified) {
      // verify email if not verified
      await collections.users?.updateOne(
        { email },
        { $set: { emailVerified: true } }
      );
    }
  }

  // verified
  req.session.userId = userId!;
  res.json({ userId, message });
};

export const googleRegister = async (req: Request, res: Response) => {
  const { credential, tutor } = req.body;

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
  user.emailVerified = true;
  user.isTutor = !!tutor;
  const result = await collections.users?.insertOne(user);

  if (result && result.insertedId) {
    req.session.userId = result.insertedId;
    res.status(201).json({ userId: result.insertedId });
  } else {
    throw new HttpError(500, "Could not create account");
  }
};

export const becomeTutor = async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await collections.users?.updateOne(
    { _id: user._id },
    {
      $set: {
        isTutor: true,
      },
    }
  );

  if (result?.matchedCount === 1) {
    if (result.modifiedCount === 0) {
      res.status(200).json({ message: "You were already a tutor" });
    } else {
      res.status(200).json({ message: "You're now a tutor!" });
    }
  } else {
    throw new HttpError(500, "Error occured");
  }
};

export const requestEmailVerification = async (req: Request, res: Response) => {
  const { id } = req.body;
  const user = await collections.users?.findOne({ _id: new ObjectId(id) });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  if (user.emailVerified) {
    res.status(200).json({ message: "Email already verified" });
    return;
  }

  const emailVerification = await collections.emailVerifications?.findOne({
    user: new ObjectId(id),
  });
  let token;
  if (emailVerification) {
    const lastSent = emailVerification.lastSent.getTime();
    const currentTime = new Date().getTime();
    if ((currentTime - lastSent) / 1000 / 60 < 15) {
      res.json({ message: "Check your email!" });
      return;
    }

    token = emailVerification.token;
  } else {
    // create new object
    token = uniqid();
    const newEmailVerification = new EmailVerification();
    newEmailVerification.user = new ObjectId(id);
    newEmailVerification.token = token;
    await collections.emailVerifications!.insertOne(newEmailVerification);
  }

  collections.emailVerifications?.updateOne(
    { token },
    {
      $set: { lastSent: new Date() },
    }
  );
  // send email verification email out
  sendEmail(
    generateEmailVerificationEmail({
      token,
      name: user.name,
      recipientEmail: user.email,
    })
  );
  res.status(200).json({ message: "Check your email!" });
};

export const verifyEmailViaToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  const emailVerification = await collections.emailVerifications?.findOne({
    token,
  });

  if (emailVerification) {
    // verify
    const result = await collections.users!.updateOne(
      {
        _id: emailVerification.user,
      },
      {
        $set: {
          emailVerified: true,
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new HttpError(404, "User not found");
    }

    // remove
    await collections.emailVerifications!.deleteOne({ token });
  } else {
    throw new HttpError(404, "Could not verify");
  }

  res.status(200).json({ message: "Email verified" });
};

export const verifyEmailViaGoogle = async (req: Request, res: Response) => {
  const { credential, id } = req.body;

  const userObject = jwt_decode(credential) as any;
  const email = userObject.email;

  // verify user
  const result = await collections.users!.updateOne(
    { _id: new ObjectId(id), email },
    { $set: { emailVerified: true } }
  );
  if (result.matchedCount === 0) {
    throw new HttpError(404, "Could not verify");
  }

  res.status(200).json({ message: "Email verified" });
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
