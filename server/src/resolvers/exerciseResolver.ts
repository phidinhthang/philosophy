// import { QueryOrder } from '@mikro-orm/core';
import { verify } from 'jsonwebtoken';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Answer } from '../entities/Answer';
import { Complete } from '../entities/Complete';
import { Exercise } from '../entities/Exercise';
import { Question } from '../entities/Question';
import { User } from '../entities/User';
import { CreateExerciseResponse, MyContext } from '../types';
import { CompleteInput, ExerciseInput, ExerciseResponse } from './inputs';
import { ExerciseError } from '../types';
import { SavedExercise } from '../entities/SavedExercise';
import { getUserById } from '../utils/auth/getUserById';
import { isAuth } from '../middleware/isAuth';

const validateExerciseInput = (
  input: ExerciseInput,
): { hasError: boolean; errors: ExerciseError } => {
  let errors: ExerciseError;
  let hasError = false;
  if (!input.title) {
    errors = { title: 'Không được bỏ trống.', questions: [] };
    hasError = true;
  } else {
    errors = { title: undefined, questions: [] };
  }

  input.questions?.forEach((q, index) => {
    if (!q.title) {
      errors.questions?.push({
        title: 'Không được bỏ trống.',
        answers: [],
      });
      hasError = true;
    } else {
      errors.questions?.push({ title: undefined, answers: [] });
    }
    q.answers?.forEach((a) => {
      if (!a.text) {
        errors.questions[index].answers?.push({
          text: 'Không được bỏ trống.',
        });
        hasError = true;
      } else {
        errors.questions[index].answers.push({ text: undefined });
      }
      const corrects = q.answers?.filter((a) => a.isCorrect);
      if (corrects?.length !== 1) {
        errors.questions[index].isCorrect =
          'Chỉ được chọn một câu trả lời đúng.';
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
  @Query(() => [ExerciseResponse])
  async getAllExercises(
    @Ctx() { em, req }: MyContext,
  ): Promise<ExerciseResponse[]> {
    const authorization = req.headers['authorization'];
    let userId = '';
    try {
      if (authorization) {
        const token = authorization.split(' ')[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        userId = payload?.userId;
      }
    } catch (err) {
      console.log(err);
    }
    em = em.fork();
    let exercises: ExerciseResponse[] = [];
    try {
      exercises = await em.getConnection('read').execute<ExerciseResponse[]>(
        ` 
          select "e"."id", e."title", e."length" ${
            userId ? ', s."user_id" as saved' : ''
          }  
          from exercise e ${
            userId
              ? `left join saved_exercise s 
            on e."id" = s."exercise_id" 
            and s."user_id" = '${userId}'`
              : ''
          }
        ;`,
      );
      console.log(exercises);
    } catch (e) {
      console.log(e);
    }
    return exercises.map((exercise) => ({
      ...exercise,
      saved: !!exercise.saved,
    }));
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

  @Mutation(() => Boolean)
  async saveExercise(
    @Arg('exerciseId', () => String) exerciseId: string,
    @Ctx() { req, em }: MyContext,
  ): Promise<boolean> {
    try {
      const user = await getUserById({ req, em });
      const exercise = em.getReference(Exercise, exerciseId);
      const alreadySaved = await em.findOne(SavedExercise, { user, exercise });

      if (alreadySaved) {
        await em.remove(alreadySaved).flush();
      } else {
        await em.persistAndFlush(em.create(SavedExercise, { user, exercise }));
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Query(() => [Exercise], { nullable: true })
  @UseMiddleware(isAuth)
  async getAllSavedExercise(
    @Ctx() { req, em }: MyContext,
  ): Promise<Exercise[]> {
    const user = await getUserById({ req, em });

    try {
      const savedExerciseIds = (
        await em.populate(user, ['savedExercises.exercise'])
      ).savedExercises;

      return savedExerciseIds.getItems().map((i) => i.exercise);
    } catch (err) {
      console.log(err);
      throw new Error('not auth');
    }
  }
}
