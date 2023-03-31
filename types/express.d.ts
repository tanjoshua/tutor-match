import { Request } from "express";
import User from "../src/base/models/User";

declare module "express" {
  interface Request {
    user?: User;
  }
}
