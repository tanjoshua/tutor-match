import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

// In the future, replace this db entry with a better storage implementation like redis
@Entity()
export class PasswordReset {
  @PrimaryKey()
  @Property()
  token: string;

  @Property()
  userId: string;

  @Property()
  expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3); // 3 days
}
