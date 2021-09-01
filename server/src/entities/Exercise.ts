import { Entity, Property, PrimaryKey } from '@mikro-orm/core';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { v4 } from 'uuid';

@ObjectType()
@Entity()
export class Exercise {
  @Field(() => ID)
  @PrimaryKey({ primary: true })
  id: string = v4();

  @Field(() => String)
  @Property()
  title!: string;

  @Field(() => Int)
  @Property()
  length!: number;
}
