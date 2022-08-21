import { User } from "../src/base/entities";
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: User;
  }
}
