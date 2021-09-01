import { QueryOrder } from '@mikro-orm/core';
import { Ctx, Query, Resolver } from 'type-graphql';
import { Exercise } from '../entities/Exercise';
import { MyContext } from '../types';

@Resolver()
export class ExerciseResolver {
  @Query(() => [Exercise])
  async getAllExercises(@Ctx() { em }: MyContext): Promise<Exercise[]> {
    const exercises = await em.find(
      Exercise,
      {},
      { orderBy: { id: QueryOrder.ASC } },
    );
    return exercises;
  }
}
