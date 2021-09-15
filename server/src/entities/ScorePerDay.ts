import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class ScorePerDay {
  @Field(() => String)
  @PrimaryKey({ primary: true, defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @ManyToOne(() => User)
  owner: User;

  @Field(() => String)
  @Property()
  day: string;

  @Field(() => Int)
  @Property()
  score: number;
}
