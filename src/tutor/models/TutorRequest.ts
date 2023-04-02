import { ObjectId } from "mongodb";
import { dateToObjectId } from "../../services/database.service";
import { oneWeekAgo } from "../../utils/date";
import { Level, Region, TutorType, Gender } from "./TutorProfile";

export default class TutorRequest {
  public _id?: ObjectId;

  // customer fields
  public name: string;
  public contactInfo: {
    phoneNumber: number; // for future use, currently not in use
    email: string;
  };
  public postalCode: string;
  public region: Region; // generate on write

  // request fields
  public gender: Gender; // preferred gender, empty if no preference
  public level: Level;
  public levelCategory: string;
  public subjects: string[];
  public type: TutorType[]; // eg. full time, part time, etc
  public pricing: {
    rate: string;
    rateOption: string; // quote me, any, market rate
  };
  public availability: string;
  public description: string; // provide any additional information

  // applicant fields
  public applicants: ObjectId[] = [];

  // other fields
  public clientAccessToken: string;
  public closed: boolean = false;

  // notifications
  public notified5apps = false;

  // user specific fields (NOT STORED)
  public applied?: boolean;

  public static assign(obj: TutorRequest) {
    const newObject = new TutorRequest();
    Object.assign(newObject, obj);
    return newObject;
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      contactInfo: this.contactInfo,
      postalCode: this.postalCode,
      region: this.region,

      gender: this.gender,
      level: this.level,
      levelCategory: this.levelCategory,
      subjects: this.subjects,
      type: this.type,
      pricing: this.pricing,
      availability: this.availability,
      description: this.description,

      applied: this.applied,
      closed:
        this.closed || (this._id && this._id < dateToObjectId(oneWeekAgo())),
    };
  }
}
