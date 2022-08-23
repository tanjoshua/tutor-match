import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import FieldError from "../errors/FieldError";

export default async (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new FieldError(400, "Validation failed", errors.array());
  }

  next();
};
