// import { QueryOrder } from '@mikro-orm/core';
import { verify } from 'jsonwebtoken';
import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Answer } from '../entities/Answer';
import { Complete } from '../entities/Complete';
import { Exercise } from '../entities/Exercise';
import { Question } from '../entities/Question';
import { User } from '../entities/User';
import { CreateExerciseResponse, MyContext } from '../types';
import {
  CompleteInput,
  ExerciseField,
  ExerciseInput,
  ExerciseResponse,
} from './inputs';
import { SavedExercise } from '../entities/SavedExercise';
import { getUserById } from '../utils/auth/getUserById';
import { isAuth } from '../middleware/isAuth';
import { validateExerciseInput } from '../utils/validateExerciseInput';
import { getUserId } from '../utils/auth/getUserId';
import { Upvote } from '../entities/Upvote';

@Resolver(ExerciseField)
export class ExerciseFieldResolver {
  @FieldResolver(() => User)
  creator(
    @Root() exercise: { creator_id: string },
    @Ctx() { userLoader }: MyContext,
  ) {
    return userLoader.load(exercise.creator_id);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() exercise: Exercise,
    @Ctx() { upvoteLoader, req }: MyContext,
  ) {
    if (!getUserId(req)) {
      return null;
    }

    const upvote = await upvoteLoader.load({
      exercise: exercise.id,
      user: getUserId(req) as string,
    });

    return upvote ? upvote.value : null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('exerciseId', () => String) exerciseId: string,
    @Arg('value', () => Int) value: number,
    @Ctx() { req, em }: MyContext,
  ) {
    em = em.fork();
    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;
    const userId = getUserId(req);

    if (!userId) return false;

    const upvote = await em.findOne(Upvote, {
      exercise: exerciseId,
      user: userId,
    });

    if (upvote && upvote.value !== realValue) {
      await em.getConnection().transactional(async (tm) => {
        await tm.raw(
          `
            update upvote
            set value = ?
            where "exercise_id" = ? and "user_id" = ?
          `,
          [realValue, exerciseId, userId],
        );

        await tm.raw(
          `
            update exercise
            set points = points + ?
            where id = ?
          `,
          [2 * realValue, exerciseId],
        );
      });
    } else if (!upvote) {
      await em.getConnection().transactional(async (tm) => {
        await tm.raw(
          `
            insert into upvote (user_id, exercise_id, value)
            values (?, ?, ?)
          `,
          [userId, exerciseId, realValue],
        );
        await tm.raw(
          `
            update exercise set points = points + ?
            where id = ?

          `,
          [realValue, exerciseId],
        );
      });
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteExercise(
    @Arg('id', () => String) id: string,
    @Ctx() { req, em }: MyContext,
  ): Promise<boolean> {
    const userId = getUserId(req)!;
    const exercise = await em.findOne(Exercise, { id, creator: userId });
    if (!exercise) return false;

    try {
      await em.getConnection('write').transactional(async (tm) => {
        await tm.raw(
          `
          delete from completes where exercise_id = ?
        `,
          [id],
        );
        await tm.raw(
          `
          delete from saved_exercise where exercise_id = ?
          `,
          [id],
        );
        await tm.raw(
          `
          delete from upvote where exercise_id = ?
        `,
          [id],
        );
        await tm.raw(
          `
          delete from exercise where id = ? and creator_id = ?
        `,
          [id, userId],
        );
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateExercise(
    @Arg('id', () => String) id: string,
    @Arg('title') title: string,
    @Ctx() { em, req }: MyContext,
  ): Promise<boolean> {
    console.log('title ', title);
    em = em.fork();
    const userId = getUserId(req)!;
    await em.nativeUpdate(Exercise, { id, creator: userId }, { title });
    return true;
  }

  @Query(() => ExerciseResponse)
  @UseMiddleware(isAuth)
  async getAllExercises(
    @Arg('cursor', () => String, { nullable: true }) cursor: string,
    @Arg('limit', () => Int, { defaultValue: 1 }) limit: number = 1,
    @Ctx() { em, req }: MyContext,
  ): Promise<ExerciseResponse> {
    /**
     * Limit can't beyond 30
     */
    limit = Math.min(limit, 30);
    const limitPlusOne = limit + 1;
    em = em.fork();
    const authorization = req.headers['authorization']!;
    const token = authorization.split(' ')[1];
    const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const userId = payload?.userId;

    let exercises: ExerciseField[] = [];
    let hasMore = true;
    try {
      exercises = await em.getConnection('read').execute<ExerciseField[]>(
        ` 
          select "e"."id", e."title", e."length", e."creator_id",e."points" , e."created_at" as "createdAt" ${
            userId ? ', s."user_id" as saved' : ''
          }  
          from exercise e ${
            userId
              ? `left join saved_exercise s 
            on e."id" = s."exercise_id" 
            and s."user_id" = '${userId}'`
              : ''
          }
          ${cursor ? `where e."created_at" < '${cursor}'` : ``}
          order by "created_at" desc
          limit ${limitPlusOne}
        ;`,
      );

      console.log(exercises);
      if (exercises.length !== limitPlusOne) {
        hasMore = false;
      }
      exercises = exercises.slice(0, limit);
      exercises.forEach((e) => {
        e.saved = !!e.saved;
      });
    } catch (e) {
      console.log(e);
    }
    return { exercises, hasMore };
  }

  @Mutation(() => CreateExerciseResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async createExercise(
    @Ctx() { em, req }: MyContext,
    @Arg('input') input: ExerciseInput,
  ): Promise<CreateExerciseResponse> {
    try {
      em = em.fork();
      const userId = getUserId(req)!;
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
        createdAt: new Date().getTime().toString(),
        points: 0,
        creator: em.getReference(User, userId),
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
    em = em.fork();

    const user = await getUserById({ req, em });

    try {
      const savedExerciseIds = (
        await em.populate(user, ['savedExercises.exercise'])
      ).savedExercises;

      return savedExerciseIds.getItems().map((i) => i.exercise);
    } catch (err) {
      console.log(err);
      throw new Error('Có lỗi xảy ra. Vui lòng thử lại');
    }
  }

  @Query(() => ID)
  async getRandomExercise(
    @Ctx() { em }: MyContext,
    @Arg('currentId', () => String) currentId: string,
  ) {
    em = em.fork();
    const exericse = await em.getConnection('read').execute<Exercise[]>(
      `
      select e."id", e."title", e."length", e."created_at" from exercise e where e."id" <> ? order by random() limit 1;
    `,
      [currentId],
    );

    return exericse[0].id;
  }
}

@Resolver(Exercise)
export class exerciseResolver {
  @FieldResolver(() => User)
  creator(@Root() exercise: Exercise, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(exercise.creator.id);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() exercise: Exercise,
    @Ctx() { upvoteLoader, req }: MyContext,
  ) {
    if (!getUserId(req)) {
      return null;
    }

    const upvote = await upvoteLoader.load({
      exercise: exercise.id,
      user: getUserId(req) as string,
    });

    return upvote ? upvote.value : null;
  }

  @Query(() => Exercise, { nullable: true })
  exercise(
    @Arg('id', () => String) id: string,
    @Ctx() { em }: MyContext,
  ): Promise<Exercise | null> {
    em = em.fork();
    return em.findOne(Exercise, { id }, ['questions.answers']);
  }
}
