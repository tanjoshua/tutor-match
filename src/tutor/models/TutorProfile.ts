import { ObjectId } from "mongodb";
import User from "../../base/models/User";

export enum Level {
  // Primary
  Pri1 = "Primary 1",
  Pri2 = "Primary 2",
  Pri3 = "Primary 3",
  Pri4 = "Primary 4",
  Pri5 = "Primary 5",
  Pri6 = "Primary 6",

  // Sec 1
  Sec1Express = "Secondary 1 (Express)",
  Sec1NA = "Secondary 1 (Normal Academic)",
  Sec1NT = "Secondary 1 (Normal Technical)",
  Sec1IP = "Secondary 1 (Integrated Program)",

  // Sec 2
  Sec2Express = "Secondary 2 (Express)",
  Sec2NA = "Secondary 2 (Normal Academic)",
  Sec2NT = "Secondary 2 (Normal Technical)",
  Sec2IP = "Secondary 2 (Integrated Program)",

  // Sec 3
  Sec3Express = "Secondary 3 (Express)",
  Sec3NA = "Secondary 3 (Normal Academic)",
  Sec3NT = "Secondary 3 (Normal Technical)",
  Sec3IP = "Secondary 3 (Integrated Program)",

  // Sec 4
  Sec4Express = "Secondary 4 (Express)",
  Sec4NA = "Secondary 4 (Normal Academic)",
  Sec4NT = "Secondary 4 (Normal Technical)",
  Sec4IP = "Secondary 4 (Integrated Program)",

  // JC
  JC1 = "Junior College 1 (JC1)",
  JC2 = "Junior College 2 (JC2)",
  JC3 = "MI Year 3",

  // TODO: add more
}

export enum TutorType {
  PartTime = "Part-Time Tutor",
  FullTime = "Full-Time Tutor",
  MOE = "Ex/Current MOE Tutor",
}

export enum Region {
  Central = "Central",
  East = "East",
  North = "North",
  NorthEast = "North-East",
  West = "West",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export default class TutorProfile {
  public _id?: ObjectId;
  public isPublic: boolean; // whether the profile shows up on the marketplace
  public owner: ObjectId;
  public urlId: string; // unique id for unique profile url

  // picture
  public profilePic?: {
    key: string;
    location: string;
  };

  // listing fields
  public title: string;
  public gender: Gender;
  public regions: Region[];
  public tutorName: string;
  public levels: Level[];
  public subjects: {
    [keys: string]: string[];
  };
  public type: TutorType; // eg. full time, part time, etc
  public qualifications: string; // for teaching experience and academic
  public description: string;
  public pricing: {
    rate: number;
    details: string; // offer more clarity on pricing
  };
  public contactInfo: {
    phoneNumber?: number;
    email?: string;
    telegram?: string;
  };

  // optimization fields - fields to speed up filtering
  public allSubjects: string[];

  // populated fields
  public ownerDetails: User;

  public static assign(obj: TutorProfile) {
    const profile = new TutorProfile();
    Object.assign(profile, obj);

    if (!profile.allSubjects) {
      // flatten subjects field into array
      let allSubjects: string[] = [];
      for (const subject of Object.values(profile.subjects)) {
        allSubjects = allSubjects.concat(subject);
      }
      profile.allSubjects = allSubjects;
    }

    if (obj.ownerDetails) {
      const ownerDetails = User.assign(obj.ownerDetails);
      profile.ownerDetails = ownerDetails;
    }
    return profile;
  }

  toJSON() {
    // populate owner

    return {
      id: this._id,
      urlId: this.urlId,
      ownerDetails: this.ownerDetails,

      profilePic: this.profilePic,

      title: this.title,
      regions: this.regions,
      gender: this.gender,
      tutorName: this.tutorName,
      levels: this.levels,
      subjects: this.subjects,
      type: this.type,
      qualifications: this.qualifications,
      description: this.description,
      pricing: this.pricing,
      contactInfo: this.contactInfo,
    };
  }
}
