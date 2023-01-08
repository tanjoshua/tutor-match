import {
  Entity,
  Property,
  Embeddable,
  Embedded,
Enum,
} from "@mikro-orm/core";
import { BaseEntity } from "../../base/entities/BaseEntity";

export enum PaymentMethod {
  INSTRUCTION = "Instruction",
  PAYNOW = "Paynow",
}

@Embeddable()
export class PaynowRecipient {
  // can only have either uen or phone number
  @Property()
  uen: string;

  @Property()
  singaporePhoneNumber: string;
}

@Entity()
export class SavedPaynow extends BaseEntity {}

@Embeddable()
export class InvoicePayment {
  @Enum(() => PaymentMethod)
  method: PaymentMethod;

  @Property()
  total: number;

  // CUSTOM INSTRUCTION FIELDS
  @Property()
  instructions?: string; // if instruction method

  // PAYNOW FIELDS
  @Embedded(() => PaynowRecipient)
  customPaynowRecipient?: PaynowRecipient;

  @Property()
  reference: string; // reference number invoice number

  @Property({ persist: false }) // workaround to allow me to store value at request time
  qrCode: string;
}
