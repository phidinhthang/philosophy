if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
/**
 * Node modules
 */
import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';

import { __isProd__ } from './constants';
import { MyContext } from './types';
import { User } from './entities/User';

/**
 * Auth utils
 */
import { verify } from 'jsonwebtoken';
import { createAccessToken } from './utils/auth/createToken';

/**
 * Loaders
 */
import mikroOrmConfig from './loaders/mikro-orm.config';
import { app } from './loaders/app';
import { configPassport } from './loaders/passport-oauth';

/**
 * Resolver
 */
import { UserResolver } from './resolvers/userResolver';
import { helloResolver } from './resolvers/helloResolver';
import {
  ExerciseFieldResolver,
  exerciseResolver,
} from './resolvers/exerciseResolver';
import { QuestionResolver } from './resolvers/questionResolver';
import { AccountResolver } from './resolvers/accountResolver';
import { createUserLoader } from './utils/createUserLoader';
import { createUpvoteLoader } from './utils/createUpvoteLoader';

const PORT = process.env.PORT || 4000;

const main = async () => {
  // database configuration
  const orm = await MikroORM.init(mikroOrmConfig);

  if (process.env.NODE_ENV === 'production' || true) {
    const migrator = orm.getMigrator();
    await migrator.up();
  }

  const redis = new Redis(process.env.REDIS_URL, {
    password: __isProd__ ? process.env.REDIS_PASSWORD : undefined,
  });

  app.post('/refresh_token', async (req, res) => {
    console.log('refresh_token_run');
    const em = orm.em.fork();
    const token = req.cookies.jid;
    console.log(token);
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log('refresh_token_run error', err);
      return res.send({ ok: false, accessToken: '' });
    }

    const user = await em.findOne(User, { id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    // sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  configPassport({ app, em: orm.em });

  // Create Apollo server and listen to port
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        helloResolver,
        UserResolver,
        ExerciseFieldResolver,
        exerciseResolver,
        QuestionResolver,
        AccountResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) =>
      ({
        req,
        res,
        em: orm.em,
        redis,
        userLoader: createUserLoader(orm.em.fork()),
        upvoteLoader: createUpvoteLoader(orm.em.fork()),
      } as unknown as MyContext),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await server.start();
  server.applyMiddleware({ app, cors: false });
  app.listen(PORT, () => console.log('server is running'));
};

main().catch((e) => console.log(e));
