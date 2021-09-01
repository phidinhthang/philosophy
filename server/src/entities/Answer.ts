import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';
import { Question } from './Question';

@ObjectType()
@Entity()
export class Answer {
  @Field(() => ID)
  @PrimaryKey({ primary: true })
  id: string = v4();

  @Field(() => String)
  @Property()
  text: string;

  @Field(() => Question)
  @ManyToOne(() => Question)
  question: Question;
}
