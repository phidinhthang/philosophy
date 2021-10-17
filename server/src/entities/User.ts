import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/knex';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getTodayTime } from '../utils/time/getTodayTime';
import { Complete } from './Complete';
import { Exercise } from './Exercise';
import { SavedExercise } from './SavedExercise';
import { ScorePerDay } from './ScorePerDay';
import { Upvote } from './Upvote';

@ObjectType()
@Entity({
  tableName: 'users',
})
export class User {
  @Field(() => ID)
  @PrimaryKey({ primary: true, defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property({ nullable: true })
  googleId?: string;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  email?: string;

  @Field(() => String)
  @Property()
  firstName!: string;

  @Field(() => String)
  @Property()
  lastName!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  avatarUrl?: string;

  @Property({ nullable: true })
  password?: string;

  @Field(() => Int)
  @Property({ default: 0, defaultRaw: '0' })
  score: number = 0;

  @OneToMany(() => Upvote, (upvote) => upvote.user)
  upvotes = new Collection<Upvote>(this);

  @OneToMany(() => Exercise, (exercise) => exercise.creator)
  exercises = new Collection<Exercise>(this);

  @Field(() => [Complete], { nullable: true })
  @OneToMany(() => Complete, (complete) => complete.user)
  completes = new Collection<Complete>(this);

  @Field(() => [SavedExercise], { nullable: true })
  @OneToMany(() => SavedExercise, (saved) => saved.user)
  savedExercises = new Collection<SavedExercise>(this);

  @Field(() => [ScorePerDay], { nullable: true })
  @OneToMany(() => ScorePerDay, (score) => score.owner)
  scorePerDay = new Collection<ScorePerDay>(this);

  async updateScore(em: EntityManager, score: number) {
    this.score += score;

    let todayScore = await em.findOne(ScorePerDay, {
      owner: this,
      day: getTodayTime(),
    });
    if (todayScore) todayScore.score += score;
    else {
      todayScore = await em.create(ScorePerDay, {
        owner: this,
        day: getTodayTime(),
        score,
      });
    }

    em.persistAndFlush([this, todayScore]);
  }
}
