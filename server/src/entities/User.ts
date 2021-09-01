import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';

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
}
