import { ObjectId } from "mongodb";

export default class User {
  public _id?: ObjectId;
  public name: string;
  public email: string;
  public password?: string;
  public emailVerified: boolean = false;
  public nextInvoiceNumber: number = 0;

  public static assign(obj: User): User {
    const user = new User();
    Object.assign(user, obj);
    return user;
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      email: this.email,
      emailVerified: this.emailVerified,
      hasNormalLogin: !!this.password,
    };
  }
}
