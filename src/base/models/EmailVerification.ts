import { ObjectId } from "mongodb";

export default class EmailVerification {
  public _id?: ObjectId;
  public user: ObjectId;
  public token: string;
}
