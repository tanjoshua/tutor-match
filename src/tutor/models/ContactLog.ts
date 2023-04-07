import { ObjectId } from "mongodb";

export default class ContactLog {
  public _id?: string;
  public tutorProfile: ObjectId;
  public name: string;
  public email: string;
  public phoneNumber?: string;
  public message: string;
}
