import { ValidationError } from "express-validator";
import HttpError from "./HttpError";

export default class FieldError extends HttpError {
  public status: number;
  public message: string;
  public errors: ValidationError[];
  constructor(status: number, message: string, errors: ValidationError[]) {
    super(status, message);
    this.errors = errors;
  }
}
