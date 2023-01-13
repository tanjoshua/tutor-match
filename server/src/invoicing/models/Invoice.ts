import { ObjectId } from "mongodb";
import { GST_RATE } from "../../utils/constants";

export enum InvoiceState {
  DRAFT = "Draft",
  PENDING_PAYMENT = "Pending Payment",
  RECEIVED = "Payment Received",
}

export enum PaymentMethod {
  INSTRUCTION = "Instruction",
  PAYNOW = "Paynow",
}

export class PaynowRecipient {
  // can only have either uen or phone number

  constructor(public uen: string, public singaporePhoneNumber: string) {}
}

export class InvoicePayment {
  public qrCode?: string;

  constructor(
    public method: PaymentMethod,
    public total: number,
    public reference: string, // invoice number prolly
    public customPaynowRecipient?: PaynowRecipient,
    public instructions?: string // if instruction method
  ) {}
}

export class InvoiceEntry {
  constructor(
    public name: string,
    public quantity: number,
    public unitPrice: number
  ) {}
}

export default class Invoice {
  public _id?: ObjectId;
  public invoiceNumber: number;
  public title: string;
  public owner: ObjectId;
  public client: any;
  public state: InvoiceState;
  public entries: InvoiceEntry[];
  public hasGST: boolean;
  public comments: string;
  public payment?: InvoicePayment;

  get gstAmount() {
    let amount = 0;
    if (!this.hasGST) {
      return amount; // return 0 if gst not enabled
    }

    for (const entry of this.entries) {
      const value = entry.quantity * entry.unitPrice;
      amount += value * GST_RATE;
    }
    return amount;
  }

  get total() {
    let total = 0;
    for (const entry of this.entries) {
      const value = entry.quantity * entry.unitPrice;
      total += value;
    }

    total += this.gstAmount;

    return total;
  }

  toJSON() {
    // populate owner

    return {
      id: this._id,
      invoiceNumber: this.invoiceNumber,
      title: this.title,
      owner: this.owner,
      client: this.client,
      state: this.state,
      entries: this.entries,
      hasGST: this.hasGST,
      comments: this.comments,
      payment: this.payment,
      gstAmount: this.gstAmount,
      total: this.total,
    };
  }
}
