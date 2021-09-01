import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 } from 'uuid';
import { Answer } from './Answer';
import { Exercise } from './Exercise';

@ObjectType()
@Entity({ tableName: 'questions' })
export class Question {
  @Field(() => ID)
  @PrimaryKey({ primary: true })
  id: string = v4();

  @Field(() => String)
  @Property()
  title: string;

  @Field(() => Exercise)
  @ManyToOne(() => Exercise)
  exercise: Exercise;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.question)
  answers = new Collection<Answer>(this);

  @Field(() => Answer)
  @OneToOne(() => Answer)
  correct: Answer;
}
