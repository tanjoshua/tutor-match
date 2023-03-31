import { Request } from "express";
import User from "../base/models/User";

declare module "express" {
  interface Request {
    user?: User;
  }
}
