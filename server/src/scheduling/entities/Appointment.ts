import { Entity, Enum, Property } from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";
import { Schedule } from "./Schedule";

export enum Proposer {
  CLIENT = "client",
  OWNER = "owner",
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

@Entity()
export class Appointment extends BaseEntity {
  @Property()
  owner: User;

  @Property()
  client: AppointmentClient;

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
  client: AppointmentClient;

  @Property()
  schedule: Schedule;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;

  @Property()
  appointment: Appointment; // only populated once confirmed

  /**
   * Intitial creation of pending appointment always done by client
   * But we allow for subsequent proposal of new appointment slots by the owner
   */
  @Enum(() => Proposer)
  proposer: Proposer;
}

@Entity()
export class RescheduleAppointmentRequest extends BaseEntity {
  @Property()
  owner: User;

  @Property()
  client: AppointmentClient;

  @Property()
  schedule: Schedule;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;

  @Property()
  appointment: Appointment;

  /**
   * Intitial creation of pending appointment always done by client
   * But we allow for subsequent proposal of new appointment slots by the owner
   */
  @Enum(() => Proposer)
  proposer: Proposer;
}
