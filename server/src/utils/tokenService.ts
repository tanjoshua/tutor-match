import jwt from "jsonwebtoken";

import HttpError from "../errors/HttpError";
import { JWT_KEY } from "./config";

interface DecodedToken {
  userId: string;
  name: string;
}

export const verifyToken = (token: string): DecodedToken => {
  const parsedToken = jwt.verify(token, JWT_KEY);

  // not authenticated
  if (!parsedToken) {
    throw new HttpError(401, "Unauthorized");
  }

  return <DecodedToken>parsedToken;
};

export const createToken = (tokenData: DecodedToken): string => {
  const token = jwt.sign(tokenData, JWT_KEY);
  return token;
};
