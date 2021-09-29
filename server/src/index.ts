if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import 'reflect-metadata';
import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { __isProd__ } from './constants';
import mikroOrmConfig from './mikro-orm.config';
import { MyContext } from './types';
import { helloResolver } from './resolvers/helloResolver';
import { UserResolver } from './resolvers/userResolver';
import { User } from './entities/User';
// import argon2 from 'argon2';
import { verify } from 'jsonwebtoken';
import { sendRefreshToken } from './utils/auth/sendRefreshToken';
import {
  createAccessToken,
  createRefreshToken,
} from './utils/auth/createToken';
// import { seed } from './seed/seed';
// import { EntityManager } from '@mikro-orm/postgresql';
import { ExerciseResolver } from './resolvers/exerciseResolver';
import { QuestionResolver } from './resolvers/questionResolver';
import { configPassport } from './passport-oauth';

const PORT = process.env.PORT || 4000;

const main = async () => {
  // database configuration
  const orm = await MikroORM.init(mikroOrmConfig);

  if (process.env.NODE_ENV === 'production' || true) {
    const migrator = orm.getMigrator();
    // await migrator.createMigration();
    // await migrator.down({ to: 0 });
    await migrator.up();
  }
  // if (!__isProd__) {
  //   const conn = orm.em.getConnection();
  //   await conn.execute('delete from "users"');
  //   const user = orm.em.create(User, {
  //     name: 'thang',
  //     password: await argon2.hash('thang'),
  //   });
  //   // await seed(orm.em as EntityManager);
  //   await orm.em.persistAndFlush(user);
  // }

  // express app setup
  const app = express();
  console.log(process.env.FRONTEND_NEXTJS_URL);
  app.use(
    cors({
      origin: process.env.FRONTEND_NEXTJS_URL!,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.get('/', (_req, res) => res.send('hello'));
  app.post('/refresh_token', async (req, res) => {
    const em = orm.em.fork();
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: '' });
    }

    const user = await em.findOne(User, { id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  app.post('/get_refresh_token', (req, res) => {
    const refresh_token = req.body.refresh_token;
    console.log(refresh_token);

    sendRefreshToken(res, refresh_token);
    res.send({ ok: 1 });
  });

  configPassport({ app, em: orm.em });

  // Create Apollo server and listen to port
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        helloResolver,
        UserResolver,
        ExerciseResolver,
        QuestionResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) =>
      ({ req, res, em: orm.em } as unknown as MyContext),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await server.start();
  server.applyMiddleware({ app, cors: false });
  app.listen(PORT, () => console.log('server is running'));
};

main().catch((e) => console.log(e));
