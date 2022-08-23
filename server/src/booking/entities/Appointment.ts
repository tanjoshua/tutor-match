import { Entity, Property } from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";
import { Schedule } from "./Schedule";

@Entity()
export class Appointment extends BaseEntity {
  @Property()
  owner: User;

  @Property()
  schedule: Schedule;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;
}

@Entity()
export class PendingAppointment extends BaseEntity {
  @Property()
  owner: User;

  @Property()
  schedule: Schedule;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;

  @Property()
  appointment: Appointment;
}

@Entity()
export class AppointmentClient extends BaseEntity {
  @Property()
  user: User; // this is optional - probably not used in early versions

  @Property()
  name: string;

  @Property()
  phoneNumber: string;

  @Property()
  note: string;
}
