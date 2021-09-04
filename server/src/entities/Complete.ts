import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Exercise } from './Exercise';
import { User } from './User';

@ObjectType()
@Entity({ tableName: 'completes' })
export class Complete {
  @Field(() => User)
  @ManyToOne(() => User, { primary: true, defaultRaw: 'uuid_generate_v4()' })
  user: User;

  @Field(() => Exercise)
  @ManyToOne(() => Exercise, {
    primary: true,
    defaultRaw: 'uuid_generate_v4()',
    nullable: true,
  })
  exercise: Exercise;

  @Field(() => Int)
  @Property({ default: 0, defaultRaw: '0' })
  corrects: number = 0;

  [PrimaryKeyType]: [string, string];
}
