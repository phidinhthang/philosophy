import {
  Ctx,
  Field,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
  Mutation,
  Arg,
  UseMiddleware,
  InputType,
} from 'type-graphql';
import * as argon2 from 'argon2';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';
import { getUserById } from '../utils/auth/getUserById';
import { ADD_EMAIL_PREFIX, FORGET_PASSWORD_PREFIX } from '../constants';
import { v4 } from 'uuid';
import { sendMail } from '../utils/sendEmail';
import { LoginResponse, UserInfoResponse } from './inputs';
import { sendRefreshToken } from '../utils/auth/sendRefreshToken';
import {
  createAccessToken,
  createRefreshToken,
} from '../utils/auth/createToken';
import { ScorePerDay } from '../entities/ScorePerDay';
import { scorePlaceholder } from '../utils/scorePlaceholder';
import { getTodayTime } from '../utils/time/getTodayTime';

@ObjectType()
class TopUser implements Partial<User> {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  score: number;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;
}

@InputType()
class InfoInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}

@Resolver()
export class AccountResolver {
  @Query(() => [TopUser])
  async getTopUsers(@Ctx() { em }: MyContext): Promise<TopUser[]> {
    try {
      const topUsers = await em.getConnection('read').execute<TopUser[]>(
        `
					select u."id", u."name", u."avatar_url" as "avatarUrl", u."score" 
					from users u 
						order by u."score" desc limit 20;
				`,
      );

      return topUsers;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async uploadAvatar(
    @Arg('avatarUrl', () => String) avatarUrl: string,
    @Ctx() { em, req }: MyContext,
  ): Promise<boolean> {
    em = em.fork();

    try {
      const user = await getUserById({ req, em });

      user.avatarUrl = avatarUrl;

      await em.persistAndFlush(user);
      return true;
    } catch (err) {
      console.log(err);
      throw new Error('not auth');
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateInfo(
    @Arg('input', () => InfoInput) { firstName, lastName }: InfoInput,
    @Ctx() { req, em }: MyContext,
  ): Promise<boolean> {
    em = em.fork();
    const user = await getUserById({ req, em });

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    await em.persistAndFlush(user);
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg('newPassword', () => String) newPassword: string,
    @Arg('password', () => String) password: string,
    @Ctx() { em, req }: MyContext,
  ): Promise<boolean> {
    em = em.fork();
    const user = await getUserById({ req, em });

    const match = await argon2.verify(user.password!, password);

    if (!match) throw new Error('Mật khẩu cũ không chính xác.');

    const hashedPassword = await argon2.hash(newPassword);

    user.password = hashedPassword;

    await em.persistAndFlush(user);

    return true;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis, em }: MyContext,
  ) {
    em = em.fork();

    const user = await em.findOne(User, { email });

    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3,
    );

    await sendMail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">Doi mat khau</a>`,
    );

    return true;
  }

  @Mutation(() => LoginResponse)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, res, em }: MyContext,
  ): Promise<LoginResponse> {
    em = em.fork();
    if (newPassword.length < 5) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Mật khẩu phải chứa ít nhất 5 kí tự.',
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    console.log('token ', token);
    console.log('key ', key);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Có lỗi xảy ra. Vui lòng thử lại.!',
          },
        ],
      };
    }

    const user = await em.findOne(User, { id: userId });

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Tài khoản này không tồn tại.',
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);
    await redis.del(key);
    await em.persistAndFlush(user);

    sendRefreshToken(res, createRefreshToken(user));

    return {
      user,
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addEmail(
    @Arg('email', () => String) email: string,
    @Ctx() { req, em, redis }: MyContext,
  ): Promise<boolean> {
    em = em.fork();

    const user = await getUserById({ req, em });

    const emailExisted = await em.findOne(User, {
      email,
    });

    if (emailExisted && emailExisted.id !== user.id) {
      return false;
    }

    const token = v4();
    try {
      await redis.set(
        ADD_EMAIL_PREFIX + token,
        `${user.id}:${email}`,
        'ex',
        1000 * 60 * 60 * 24 * 3,
      );

      await sendMail(
        email,
        `<a href="http://localhost:3000/confirm-email/${token}">Xác nhận Email</a>`,
      );
    } catch (err) {
      console.log('abcdef ', err);
    }
    return true;
  }

  @Mutation(() => Boolean)
  async confirmEmail(
    @Arg('token', () => String) token: string,
    @Ctx() { em, redis }: MyContext,
  ): Promise<boolean> {
    console.log('run here');
    em = em.fork();
    const key = await redis.get(ADD_EMAIL_PREFIX + token);
    if (!key) {
      return false;
    }

    const [userId, email] = key.split(':');
    const user = await em.findOneOrFail(User, userId);
    user.email = email;
    await em.persistAndFlush(user);

    return true;
  }

  @Query(() => UserInfoResponse)
  async getUserInfo(
    @Arg('id', () => ID) id: string,
    @Ctx() { em }: MyContext,
  ): Promise<UserInfoResponse> {
    const user = await em.findOneOrFail(User, id);

    let scoreOfWeek = scorePlaceholder();
    const scores = await em.find(ScorePerDay, {
      day: { $gte: getTodayTime({ offset: 6 }) },
      owner: user,
    });
    scoreOfWeek = scoreOfWeek.map((score) => {
      let final: ReturnType<typeof scorePlaceholder>[0] = score;
      scores.map((s) => {
        if (s.day === score.day) {
          final = s;
        }
      });
      return final;
    });

    return {
      id: user.id,
      name: user.name,
      scorePerDay: scoreOfWeek.map((s) => ({
        id: s.id,
        score: s.score,
        day: s.day,
        owner: user,
      })),
      avatarUrl: user.avatarUrl,
    };
  }
}
