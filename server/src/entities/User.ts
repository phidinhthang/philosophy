import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';
import { Complete } from './Complete';

@ObjectType()
@Entity({
  tableName: 'users',
})
export class User {
  @Field(() => ID)
  @PrimaryKey({ primary: true })
  id: string = v4();

  @Field(() => String)
  @Property()
  name!: string;

  @Property()
  password!: string;

  @Field(() => [Complete])
  @OneToMany(() => Complete, (complete) => complete.user)
  completes = new Collection<Complete>(this);
}
