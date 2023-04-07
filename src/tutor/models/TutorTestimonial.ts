import { ObjectId } from "mongodb";

export default class TutorTestimonial {
  public _id?: ObjectId;
  public tutorProfile: ObjectId;
  public author: ObjectId;
  public title: string;
  public testimonial: string;

  // populated fields
  public authorName: string;

  public static assign(obj: TutorTestimonial) {
    const newObject = new TutorTestimonial();
    Object.assign(newObject, obj);
    return newObject;
  }

  toJSON() {
    return {
      id: this._id,
      tutorProfile: this.tutorProfile,
      author: this.author,
      authorName: this.authorName,
      title: this.title,
      testimonial: this.testimonial,
    };
  }
}
