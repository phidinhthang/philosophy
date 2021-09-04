import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Question } from './Question';

@ObjectType()
@Entity()
export class Answer {
  @Field(() => ID)
  @PrimaryKey({ primary: true, defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field(() => String)
  @Property()
  text: string;

  @Field(() => Question)
  @ManyToOne(() => Question, { cascade: [Cascade.ALL] })
  question?: Question;

  @Property({ default: false, defaultRaw: 'false' })
  isCorrect: boolean = false;
}
