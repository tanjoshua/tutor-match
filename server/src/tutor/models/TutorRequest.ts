import { ObjectId } from "mongodb";
import { Level, Region, TutorType, Gender } from "./Profile";

export default class TutorRequest {
  public _id?: ObjectId;

  // customer fields
  public contactInfo: {
    phoneNumber: number; // for future use, currently not in use
    email: string;
  };
  public postalCode: string;
  public region: Region; // generate on write

  // request fields
  public gender: Gender[]; // preferred gender
  public level: Level;
  public subjects: string[];
  public type: TutorType[]; // eg. full time, part time, etc
  public pricing: {
    rate: number;
    rateOption: string; // quote me, any, market rate
  };
  public description: string; // provide any additional information

  public static assign(obj: TutorRequest) {
    const newObject = new TutorRequest();
    Object.assign(newObject, obj);
    return newObject;
  }

  toJSON() {
    return {
      id: this._id,
      contactInfo: this.contactInfo,
      postalCode: this.postalCode,
      region: this.region,

      gender: this.gender,
      level: this.level,
      subjects: this.subjects,
      type: this.type,
      pricing: this.pricing,
      description: this.description,
    };
  }
}
