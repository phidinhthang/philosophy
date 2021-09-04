// import { QueryOrder } from '@mikro-orm/core';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Answer } from '../entities/Answer';
import { Complete } from '../entities/Complete';
import { Exercise } from '../entities/Exercise';
import { Question } from '../entities/Question';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { CompleteInput, ExerciseInput } from './inputs';

@Resolver()
export class ExerciseResolver {
  @Query(() => [Exercise])
  async getAllExercises(@Ctx() { em }: MyContext): Promise<Exercise[]> {
    em = em.fork();
    const exercises = await em
      .createQueryBuilder(Exercise)
      .select('*')
      .getResult();
    // await em.populate(exercises, ['questions']);

    return exercises;
  }

  @Mutation(() => Boolean)
  async createExercise(
    @Ctx() { em }: MyContext,
    @Arg('input') input: ExerciseInput,
  ): Promise<boolean> {
    const newExercise = em.create(Exercise, {
      title: input.title,
      length: input.questions?.length || 0,
    });
    input.questions?.forEach((q) => {
      const newQuestion = em.create(Question, q);
      q.answers?.forEach((a) => {
        const newAnswer = em.create(Answer, a);
        newQuestion.answers.add(newAnswer);
      });
      newExercise.questions.add(newQuestion);
    });
    try {
      await em.persistAndFlush(newExercise);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async saveComplete(
    @Arg('input') input: CompleteInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<boolean> {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return false;
    }
    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      console.log(payload);
      const user = em.getReference(User, payload.userId);
      const exercise = em.getReference(Exercise, input.exerciseId);
      if (!exercise || !user) return false;
      await em.nativeInsert(Complete, {
        corrects: input.corrects,
        user,
        exercise,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
