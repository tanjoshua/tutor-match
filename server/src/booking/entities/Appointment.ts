import { Entity, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
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
