import { Session } from "express-session";
import { ObjectId } from "mongodb";

declare module "express-session" {
  interface Session {
    userId: ObjectId;
  }
}
