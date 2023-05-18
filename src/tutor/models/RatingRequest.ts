import { ObjectId } from "mongodb";

export default class RatingRequest {
  public _id?: ObjectId;
  public tutorProfile: ObjectId;
  public tutorUrlId: string;

  public token: string;
  public email: string;
  public message: string;
}
