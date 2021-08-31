import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { buildSchema } from 'type-graphql';
import { helloResolver } from './resolvers/helloResolver';

const PORT = process.env.PORT || 4000;

const main = async () => {
  const app = express();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [helloResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => console.log('server is running'));
};

main().catch((e) => console.log(e));
