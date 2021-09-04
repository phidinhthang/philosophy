import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Complete } from './Complete';

@ObjectType()
@Entity({
  tableName: 'users',
})
export class User {
  @Field(() => ID)
  @PrimaryKey({ primary: true, defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field(() => String)
  @Property()
  name!: string;

  @Property()
  password!: string;

  @Field(() => [Complete])
  @OneToMany(() => Complete, (complete) => complete.user)
  completes = new Collection<Complete>(this);
}
