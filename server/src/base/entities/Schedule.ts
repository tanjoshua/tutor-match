import {
  Embeddable,
  Entity,
  ManyToOne,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User";

@Entity()
export class Schedule extends BaseEntity {
  @OneToOne()
  user: User;
}

@Embeddable()
export class Timeslot {
  @ManyToOne()
  schedule: Schedule;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;

  @Property()
  available: boolean; // if false, override to be not available
}

@Embeddable()
export class RecurringTimeslot {
  @ManyToOne()
  schedule: Schedule;

  @Property()
  day: number; // 0-6 representing each day of the week

  @Property()
  time: number; // 0-47 representing 30 min timeslots in the day
}
