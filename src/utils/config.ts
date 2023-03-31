import dotenv from "dotenv";
dotenv.config();

// instead of taking environment variables directly across the application, we created a proper constant for every environment variable here
// when adding to the .env file, make sure to add the variable here

export const JWT_KEY = process.env.JWT_KEY!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const PORT = process.env.PORT;
export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "ace_session";

// using mongodb native driver
export const DB_CONN_STRING = process.env.DB_CONN_STRING!;
export const DB_NAME = process.env.DB_NAME!;

// email sending
export const EMAIL = process.env.EMAIL!;

// godaddy email sending
export const GODADDY_EMAIL = process.env.GODADDY_EMAIL;
export const GODADDY_PASSWORD = process.env.GODADDY_PASSWORD;

// s3 bucket
export const S3_PP_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY!;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY!;
export const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION!;

// domain
export const WEB_URL = "http://localhost:3000";
