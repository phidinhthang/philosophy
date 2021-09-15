// import { QueryOrder } from '@mikro-orm/core';
import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Answer } from '../entities/Answer';
import { Complete } from '../entities/Complete';
import { Exercise } from '../entities/Exercise';
import { Question } from '../entities/Question';
import { User } from '../entities/User';
import { CreateExerciseResponse, MyContext } from '../types';
import { CompleteInput, ExerciseInput } from './inputs';
import { ExerciseError } from '../types';

const validateExerciseInput = (
  input: ExerciseInput,
): { hasError: boolean; errors: ExerciseError } => {
  let errors: ExerciseError;
  let hasError = false;
  if (!input.title) {
    errors = { title: 'this field cannot be blank', questions: [] };
    hasError = true;
  } else {
    errors = { title: undefined, questions: [] };
  }

  input.questions?.forEach((q, index) => {
    if (!q.title) {
      errors.questions?.push({
        title: 'this field cannot be blank',
        answers: [],
      });
      hasError = true;
    } else {
      errors.questions?.push({ title: undefined, answers: [] });
    }
    q.answers?.forEach((a) => {
      if (!a.text) {
        errors.questions[index].answers?.push({
          text: 'this field cannot be blank',
        });
        hasError = true;
      } else {
        errors.questions[index].answers.push({ text: undefined });
      }
      const corrects = q.answers?.filter((a) => a.isCorrect);
      if (corrects?.length !== 1) {
        errors.questions[index].isCorrect =
          'one and only one answer can be correct';
        hasError = true;
      } else {
        errors.questions[index].isCorrect = undefined;
      }
    });
  });

  return { hasError, errors };
};

@Resolver()
export class ExerciseResolver {
  @Query(() => [Exercise])
  async getAllExercises(@Ctx() { em }: MyContext): Promise<Exercise[]> {
    em = em.fork();
    const exercises = await em
      .createQueryBuilder(Exercise)
      .select('*')
      .getResult();

    return exercises;
  }

  @Mutation(() => CreateExerciseResponse, { nullable: true })
  async createExercise(
    @Ctx() { em }: MyContext,
    @Arg('input') input: ExerciseInput,
  ): Promise<CreateExerciseResponse> {
    const { errors, hasError } = validateExerciseInput(input);
    if (hasError) {
      return {
        hasError,
        errors,
      };
    }
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
      return { hasError, exercise: newExercise };
    } catch (err) {
      console.log(err);
      return { hasError: true };
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
      const existedComplete = await em.findOne(Complete, { user, exercise });
      console.log('existed ', existedComplete);
      if (existedComplete && existedComplete.corrects < input.corrects) {
        existedComplete.corrects = input.corrects;
        await em.persistAndFlush(existedComplete);
        return true;
      }
      const complete = em.create(Complete, {
        user,
        exercise,
        corrects: input.corrects,
      });
      await em.persistAndFlush(complete);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
