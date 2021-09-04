import {
  Entity,
  Property,
  PrimaryKey,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Question } from './Question';

@ObjectType()
@Entity()
export class Exercise {
  @Field(() => ID)
  @PrimaryKey({ primary: true, defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field(() => String)
  @Property()
  title!: string;

  @Field(() => Int)
  @Property()
  length!: number;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.exercise)
  questions = new Collection<Question>(this);
}
