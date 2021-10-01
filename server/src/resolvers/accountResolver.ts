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

      console.log(topUsers);

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
    @Ctx() { em, req }: MyContext,
  ): Promise<boolean> {
    em = em.fork();
    const user = await getUserById({ req, em });

    const hashedPassword = await argon2.hash(newPassword);

    user.password = hashedPassword;

    await em.persistAndFlush(user);

    return true;
  }
}
