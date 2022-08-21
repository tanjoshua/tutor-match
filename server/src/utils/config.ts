import dotenv from "dotenv";
dotenv.config();

export const JWT_KEY = process.env.JWT_KEY!;
export const MDB_KEY = process.env.MDB_KEY!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const PORT = process.env.PORT;
export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "ace_session";
