import dotenv from "dotenv";
dotenv.config();

// instead of taking environment variables directly across the application, we created a proper constant for every environment variable here
// when adding to the .env file, make sure to add the variable here

export const JWT_KEY = process.env.JWT_KEY!;
export const MDB_KEY = process.env.MDB_KEY!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const PORT = process.env.PORT;
export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "ace_session";

// using mongodb native driver
export const DB_CONN_STRING = process.env.DB_CONN_STRING;
export const DB_NAME = process.env.DB_NAME;
