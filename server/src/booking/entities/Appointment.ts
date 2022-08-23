import { Entity, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";
import { BookingEngine } from "./BookingEngine";

@Entity()
export class Appointment extends BaseEntity {
  @Property()
  owner: User;

  @Property()
  bookingEngine: BookingEngine;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;
}
