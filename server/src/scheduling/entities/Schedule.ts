import { Embeddable, Embedded, Entity, Property } from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";

@Entity()
export class Schedule extends BaseEntity {
  @Property()
  user: User;

  @Embedded(() => Timeslot, { array: true })
  timeslots: Timeslot[] = [];

  @Embedded(() => RecurringTimeslot, { array: true })
  recurringTimeslots: RecurringTimeslot[] = [];
}

@Embeddable()
export class Timeslot {
  @Property()
  startTime: Date;

  @Property()
  endTime: Date;

  @Property()
  available: boolean; // if false, something took this timeslot
}

@Embeddable()
export class RecurringTimeslot {
  @Property()
  timezone: string; // currently not used. to be used when revamping scheduling to better support internationalization

  @Property()
  day: number; // 0-6 representing each day of the week

  @Property()
  timeblock: number; // 0-47 representing 30 min timeslots in the day
}
