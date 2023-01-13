import { User } from "../src/base/entities";
import { Request } from "express";
import { User as UserClass } from "../src/base/models/User";

declare module "express" {
  interface Request {
    user?: User;
    sessionUser?: UserClass;
  }
}
