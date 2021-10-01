import { User } from '../entities/User';
import {
  Mutation,
  Resolver,
  Ctx,
  Arg,
  Query,
  UseMiddleware,
} from 'type-graphql';
import argon2 from 'argon2';
import { CheckAnswerResponse, MyContext } from '../types';
import { validateLogin, validateRegister } from '../utils/auth/validate';
import { sendRefreshToken } from '../utils/auth/sendRefreshToken';
import {
  createAccessToken,
  createRefreshToken,
} from '../utils/auth/createToken';
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
import { isAuth } from '../middleware/isAuth';
import { getUserById } from '../utils/auth/getUserById';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    const user = await getUserById({ req, em });
    await em.populate(user, ['completes']);
    return user;
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
            message: 'Tên tài khoản không tồn tại.',
          },
        ],
      };
    }
    const match = await argon2.verify(user.password!, password);
    if (!match) {
      return {
        errors: [{ field: 'password', message: 'Mật khẩu không chính xác' }],
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
        errors: [
          {
            field: 'username',
            message:
              'Tên tài khoản này đã được sử dụng. Vui lòng chọn tên khác.',
          },
        ],
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
  @UseMiddleware(isAuth)
  async checkAnswer(
    @Arg('input') input: UserAnswerInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<CheckAnswerResponse> {
    const user = await getUserById({ req, em });
    const question = await em
      .createQueryBuilder(Question)
      .select('*')
      .where({ id: input.questionId })
      .getSingleResult();
    if (!question) throw new Error('Không tồn tại.');
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
  @UseMiddleware(isAuth)
  async getScoreOfWeek(@Ctx() { em, req }: MyContext) {
    const user = await getUserById({ em, req });
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
