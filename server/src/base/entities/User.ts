import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Listing } from "../../listing/entities";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
  @Property()
  name: string;

  @Property()
  image: string;

  @Property({ unique: true })
  email: string;

  @Property({ unique: true })
  password: string;

  @OneToMany(() => Listing, (listing) => listing.owner)
  listings = new Collection<Listing>(this);
}
