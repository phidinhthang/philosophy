import { ManyToOne, Entity, PrimaryKeyType } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { Exercise } from './Exercise';
import { User } from './User';

@ObjectType()
@Entity()
export class SavedExercise {
  @Field(() => User)
  @ManyToOne(() => User, { primary: true, defaultRaw: 'uuid_generate_v4()' })
  user: User;

  @Field(() => Exercise)
  @ManyToOne(() => Exercise, {
    primary: true,
    defaultRaw: 'uuid_generate_v4()',
  })
  exercise: Exercise;

  [PrimaryKeyType]: [string, string];
}
