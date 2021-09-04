import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';
import { Answer } from './Answer';
import { Exercise } from './Exercise';

@ObjectType()
@Entity({ tableName: 'questions' })
export class Question {
  @Field(() => ID)
  @PrimaryKey({ primary: true, defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field(() => String)
  @Property()
  title: string;

  @Field(() => Exercise)
  @ManyToOne(() => Exercise, { cascade: [Cascade.ALL] })
  exercise?: Exercise;

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.question)
  answers = new Collection<Answer>(this);
}
