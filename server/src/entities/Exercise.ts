import {
  Entity,
  Property,
  PrimaryKey,
  OneToMany,
  Collection,
  ManyToOne,
} from '@mikro-orm/core';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { Question } from './Question';
import { SavedExercise } from './SavedExercise';
import { Upvote } from './Upvote';
import { User } from './User';

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

  @Field()
  @Property({ nullable: true })
  createdAt: string;

  @Field()
  @Property()
  points!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  creator: User;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @OneToMany(() => Upvote, (upvote) => upvote.exercise)
  upvotes = new Collection<Upvote>(this);

  @OneToMany(() => SavedExercise, (saved) => saved.exercise)
  savedExercises = new Collection<SavedExercise>(this);

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.exercise)
  questions = new Collection<Question>(this);
}
