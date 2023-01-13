import { ObjectId } from "mongodb";

export default class Invoice {
  public _id?: ObjectId;
  public name: string;
  public email: string;
  public password: string;
  public nextInvoiceNumber: number = 0;
}
