import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { User } from './User';
import { Exercise } from './Exercise';

@Entity()
export class Upvote {
  @Property()
  value: number;

  @ManyToOne(() => User, { primary: true })
  user: User;

  @ManyToOne(() => Exercise, { primary: true })
  exercise: Exercise;

  [PrimaryKeyType]: [string, string];
}
