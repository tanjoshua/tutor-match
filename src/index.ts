import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import "reflect-metadata";

import {
  PORT,
  __prod__,
  SESSION_SECRET,
  COOKIE_NAME,
  DB_CONN_STRING,
  CORS_ORIGIN,
} from "./utils/config";

// ERRORS
import HttpError from "./errors/HttpError";
import FieldError from "./errors/FieldError";

// ROUTES
import baseRoutes from "./base/routes";
import invoicingRoutes from "./invoicing/routes";
import tutorRoutes from "./tutor/routes";
import { connectToDatabase } from "./services/database.service";

const app = express();
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: DB_CONN_STRING,
  collection: "sessions",
});

const main = async () => {
  // connect native mongodb driver
  await connectToDatabase();

  // body parser for json
  app.use(express.json());
  // cors
  app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

  // trust proxy
  app.set("trust proxy", true);

  // session
  app.use(
    session({
      name: COOKIE_NAME,
      secret: SESSION_SECRET,
      proxy: __prod__,
      cookie: {
        // maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        maxAge: 1000 * 60 * 60 * 24 * 182, // 0.5 year
        secure: __prod__,
        sameSite: __prod__ ? "none" : "lax",
      },
      store: store,
      resave: false,
      saveUninitialized: false,
    })
  );

  // health check
  app.get("/health", (_req, res) => {
    res.send("ok");
  });

  // ROUTES
  app.use("/api/base", baseRoutes);
  app.use("/api/invoicing", invoicingRoutes);
  app.use("/api/tutor", tutorRoutes);

  app.get("/", (_req, res) => {
    res.send("deployment test success");
  });

  // 404 route not found
  app.use((_req, res, _next) => {
    res.status(404).send("Route not found");
  });

  // error handler
  app.use(
    (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
      console.log(err);
      const status = err.status || 500;
      const body: any = { message: err.message };

      if (err instanceof FieldError) {
        body.errors = err.errors;
      }

      res.status(status).json(body);
    }
  );

  // start server
  app.listen(PORT || 8000, () => {
    console.log(`Server running on port ${PORT || 8000}`);
  });
};

main();
