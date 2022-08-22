import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { User } from "../../base/entities";
import { BaseEntity } from "../../base/entities/BaseEntity";

@Entity()
export class Listing extends BaseEntity {
  @Property()
  title: string;

  @Property()
  image: { url: string; id: string };

  @ManyToOne(() => User)
  owner: User;

  @Property()
  description: string;
}
