import {
  Cascade,
  Collection,
  Embeddable,
  Embedded,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";

@Entity()
export class Schedule extends BaseEntity {
  @ManyToOne(() => User)
  owner: User;

  @Property()
  timezone: string;

  @OneToMany(
    () => ScheduleOverride,
    (scheduleOverride) => scheduleOverride.schedule,
    { cascade: [Cascade.REMOVE] }
  )
  scheduleOverrides = new Collection<ScheduleOverride>(this);

  @Embedded(() => WeeklySchedule, { array: true })
  // index represents day of the week
  // js does not support list comprehension yet
  weeklySchedule: WeeklySchedule[] = [
    new WeeklySchedule(),
    new WeeklySchedule(),
    new WeeklySchedule(),
    new WeeklySchedule(),
    new WeeklySchedule(),
    new WeeklySchedule(),
    new WeeklySchedule(),
  ];
}

@Entity()
export class ScheduleOverride extends BaseEntity {
  @ManyToOne(() => Schedule)
  schedule: Schedule;

  @Property()
  day: string;

  @OneToMany(
    () => TimeslotOverride,
    (timeslotOverride) => timeslotOverride.scheduleOverride,
    { cascade: [Cascade.REMOVE] }
  )
  timeslots = new Collection<TimeslotOverride>(this);
}

@Entity()
export class TimeslotOverride extends BaseEntity {
  @ManyToOne(() => ScheduleOverride)
  scheduleOverride: ScheduleOverride;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;
}

@Embeddable()
export class WeeklySchedule {
  @Embedded(() => WeeklyTimeslot, { array: true })
  timeslots: WeeklyTimeslot[] = [];
}

@Embeddable()
export class WeeklyTimeslot {
  @Property()
  startTime: string;

  @Property()
  endTime: string;
}
