import {
  Entity,
  Property,
  Embeddable,
  Embedded,
  Enum,
  ManyToOne,
} from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";
import { GST_RATE } from "../../utils/constants";
import { InvoicePayment } from "./Payment";

@Entity()
export class InvoiceClient extends BaseEntity {
  @Property()
  user: User; // this is optional - probably not used in early versions

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  phoneNumber: string;
}

@Embeddable()
export class InvoiceEntry {
  @Property()
  name: string;

  @Property()
  quantity: number;

  @Property()
  unitPrice: number;
}

export enum InvoiceState {
  DRAFT = "Draft",
  PENDING_PAYMENT = "Pending Payment",
  RECEIVED = "Payment Received",
}

@Entity()
export class Invoice extends BaseEntity {
  @Property()
  invoiceNumber: number; // use user's stored nextInvoiceNumber and increment

  @Property() // invoice title
  title: string;

  @ManyToOne(() => User)
  owner: User; // user that is generating the invoice

  @Property()
  client: InvoiceClient; // this is optional - probably not used in early versions

  @Enum(() => InvoiceState)
  state: InvoiceState = InvoiceState.DRAFT;

  @Embedded(() => InvoiceEntry, { array: true })
  entries: InvoiceEntry[] = [];

  @Property()
  hasGST: boolean;

  @Property()
  comments: string;

  @Property({ persist: false }) // total cost to consumer
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

  @Property({ persist: false }) // total cost to consumer
  get total() {
    let total = 0;
    for (const entry of this.entries) {
      const value = entry.quantity * entry.unitPrice;
      total += value;
    }

    total += this.gstAmount;

    return total;
  }

  @Embedded(() => InvoicePayment)
  payment: InvoicePayment;
}
