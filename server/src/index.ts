import express, { Request, Response, NextFunction } from "express";
import {
  MikroORM,
  EntityManager,
  EntityRepository,
  RequestContext,
  ReflectMetadataProvider,
} from "@mikro-orm/core";
import cors from "cors";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import "reflect-metadata";

import {
  PORT,
  MDB_KEY,
  __prod__,
  SESSION_SECRET,
  COOKIE_NAME,
} from "./utils/config";
import { User, PasswordReset } from "./base/entities";
import { Listing } from "./listing/entities";
import baseRoutes from "./base/routes";
import listingRoutes from "./listing/routes";
import HttpError from "./errors/HttpError";
import FieldError from "./errors/FieldError";

const app = express();
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: MDB_KEY,
  collection: "sessions",
});
export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
  listingRepository: EntityRepository<Listing>;
  passwordResetRepository: EntityRepository<PasswordReset>;
};

const main = async () => {
  // setup ORM
  DI.orm = await MikroORM.init({
    entities: [User, Listing, PasswordReset],
    clientUrl: MDB_KEY,
    type: "mongo",
    debug: !__prod__,
    metadataProvider: ReflectMetadataProvider,
  });
  DI.em = DI.orm.em;
  DI.userRepository = DI.orm.em.getRepository(User);
  DI.listingRepository = DI.orm.em.getRepository(Listing);
  DI.passwordResetRepository = DI.orm.em.getRepository(PasswordReset);

  // serve frontend
  app.use(express.static("build/client"));
  // body parser for json
  app.use(express.json());
  // cors
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(
    session({
      name: COOKIE_NAME,
      secret: SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
      store: store,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));

  // health check
  app.get("/health", (_req, res) => {
    res.send("ok");
  });

  // ROUTES
  app.use("/api/base", baseRoutes);
  app.use("/api/listing", listingRoutes);

  // 404 route not found
  app.use((_req, res, _next) => {
    res.status(404).send("Route not found");
  });

  // error handler
  app.use(
    (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
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
