import { ObjectId } from "mongodb";

export default class TutorRating {
  public _id?: ObjectId;
  public tutorProfile: ObjectId;
  public author: ObjectId;
  public rating: number;
  public testimonial: string;

  // for non account ratings
  public authorEmail?: string;
  public noAccountAuthorName?: string;

  // populated fields
  public authorName: string;

  public static assign(obj: TutorRating) {
    const newObject = new TutorRating();
    Object.assign(newObject, obj);
    return newObject;
  }

  toJSON() {
    return {
      id: this._id,
      tutorProfile: this.tutorProfile,
      author: this.author,
      authorEmail: this.authorEmail,
      authorName: this.authorName,
      noAccountAuthorName: this.noAccountAuthorName,
      rating: this.rating,
      testimonial: this.testimonial,
      createdAt: this._id?.getTimestamp(),
    };
  }
}
