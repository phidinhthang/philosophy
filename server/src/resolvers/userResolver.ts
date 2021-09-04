import { User } from '../entities/User';
import {
  Mutation,
  Resolver,
  Ctx,
  Arg,
  InputType,
  ObjectType,
  Field,
  Query,
} from 'type-graphql';
import argon2 from 'argon2';
import { MyContext } from '../types';
import { CustomError } from '../utils/CustomError';
import { validateLogin, validateRegister } from '../utils/auth/validate';
import { sendRefreshToken } from '../utils/auth/sendRefreshToken';
import {
  createAccessToken,
  createRefreshToken,
} from '../utils/auth/createToken';
import { verify } from 'jsonwebtoken';
import { UserAnswerInput } from './inputs';
import { Question } from '../entities/Question';

@InputType()
class UserInput implements Partial<User> {
  @Field(() => String)
  name: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  accessToken?: string;
  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];
}

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
      return await em.findOne(User, payload.userId);
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
    @Arg('input') { name, password }: UserInput,
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
    @Arg('input') { name, password }: UserInput,
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

    const user = em.create(User, { name, password: hashedPassword });
    await em.persistAndFlush(user);

    sendRefreshToken(res, createRefreshToken(user));
    return {
      user,
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async checkAnswer(
    @Arg('input') input: UserAnswerInput,
    @Ctx() { em }: MyContext,
  ): Promise<boolean> {
    const question = await em
      .createQueryBuilder(Question)
      .select('*')
      .where({ id: input.questionId })
      .getSingleResult();
    if (!question) return false;
    const answers = await question.answers.loadItems();
    const isCorrect = !!answers.find(
      (a) => a.id === input.answerId && a.isCorrect,
    );
    return isCorrect || false;
  }
}
