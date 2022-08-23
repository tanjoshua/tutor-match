import {
  Collection,
  Embeddable,
  Entity,
  ManyToOne,
  OneToOne,
  Property,
} from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";
import { Listing } from "../../listing/entities";

@Entity()
export class Schedule extends BaseEntity {
  @Property()
  user: User;

  @OneToOne(() => Listing)
  listing: Listing;

  @Property()
  timeslots = new Collection<Timeslot>(this);

  @Property()
  recurringTimeslots = new Collection<RecurringTimeslot>(this);
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
  available: boolean; // if false, something took this timeslot
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
