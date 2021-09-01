import { Entity, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Exercise } from './Exercise';
import { User } from './User';

@ObjectType()
@Entity({ tableName: 'completes' })
export class Complete {
  @Field(() => User)
  @ManyToOne(() => User, { primary: true })
  user: User;

  @Field(() => Exercise)
  @ManyToOne(() => Exercise, { primary: true })
  exercise: Exercise;

  [PrimaryKeyType]: [string, string];
}
