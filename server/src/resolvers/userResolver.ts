import { User } from '../entities/User';
import { Mutation, Resolver, Ctx, Arg, Query } from 'type-graphql';
import argon2 from 'argon2';
import { CheckAnswerResponse, MyContext } from '../types';
import { validateLogin, validateRegister } from '../utils/auth/validate';
import { sendRefreshToken } from '../utils/auth/sendRefreshToken';
import {
  createAccessToken,
  createRefreshToken,
} from '../utils/auth/createToken';
import { verify } from 'jsonwebtoken';
import {
  LoginInput,
  LoginResponse,
  RegisterInput,
  UserAnswerInput,
} from './inputs';
import { Question } from '../entities/Question';
import { ScorePerDay } from '../entities/ScorePerDay';
import { scorePlaceholder } from '../utils/scorePlaceholder';
import { getTodayTime } from '../utils/time/getTodayTime';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    const authorization = req.headers['authorization'];
    console.log(authorization);
    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      console.log(payload);
      const user = await em.findOne(User, payload.userId, ['completes']);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, '');
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('input') { name, password }: LoginInput,
    @Ctx() { em, res }: MyContext,
  ): Promise<LoginResponse> {
    const errors = validateLogin({ name, password });
    if (errors.length) return { errors };
    const user = await em.findOne(User, { name });
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: "username doesn't exist",
          },
        ],
      };
    }
    const match = await argon2.verify(user.password, password);
    if (!match) {
      return {
        errors: [{ field: 'password', message: 'password doesnt match' }],
      };
    }
    sendRefreshToken(res, createRefreshToken(user));
    return {
      user,
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => LoginResponse)
  async register(
    @Arg('input') { name, password, firstName, lastName }: RegisterInput,
    @Ctx() { res, em }: MyContext,
  ): Promise<LoginResponse> {
    const errors = validateRegister({ name, password });
    if (errors.length) return { errors };

    const existedUser = await em.findOne(User, { name });
    if (existedUser) {
      return {
        errors: [{ field: 'username', message: 'username already taken!' }],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, {
      name,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await em.persistAndFlush(user);
    sendRefreshToken(res, createRefreshToken(user));
    return {
      user,
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => CheckAnswerResponse)
  async checkAnswer(
    @Arg('input') input: UserAnswerInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<CheckAnswerResponse> {
    let user: User;
    const authorization = req.headers['authorization'];
    console.log(authorization);
    if (!authorization) throw new Error('not auth');
    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      console.log(payload);
      user = await em.findOneOrFail(User, payload.userId, ['completes']);
    } catch (err) {
      console.log(err);
      throw new Error('not auth');
    }
    const question = await em
      .createQueryBuilder(Question)
      .select('*')
      .where({ id: input.questionId })
      .getSingleResult();
    if (!question) throw new Error('bad request');
    const answers = await question.answers.loadItems();
    const isCorrect = !!answers.find(
      (a) => a.id === input.answerId && a.isCorrect,
    );
    let score = Math.round(Math.random() * 10) + 50;
    if (!isCorrect) {
      score = -score;
    }

    await user.updateScore(em, score);
    return {
      isCorrect,
      score,
    };
  }

  @Query(() => [ScorePerDay])
  async getScoreOfWeek(@Ctx() { em, req }: MyContext) {
    let user: User;
    const authorization = req.headers['authorization'];
    if (!authorization) {
      throw new Error('not auth');
    }
    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      console.log(payload);
      user = await em.findOneOrFail(User, payload.userId);
    } catch (err) {
      console.log(err);
      throw new Error('not auth');
    }
    let scoreOfWeek = scorePlaceholder();
    const scores = await em.find(ScorePerDay, {
      day: { $gte: getTodayTime({ offset: 6 }) },
      owner: user,
    });
    return scoreOfWeek.map((score) => {
      let final: ReturnType<typeof scorePlaceholder>[0] = score;
      scores.map((s) => {
        if (s.day === score.day) {
          final = s;
        }
      });
      return final;
    });
  }
}
