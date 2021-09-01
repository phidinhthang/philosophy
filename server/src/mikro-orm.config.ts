import { MikroORM } from '@mikro-orm/core';
import { __isProd__ } from './constants';
import path from 'path';
import { User } from './entities/User';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    disableForeignKeys: false,
  },
  entities: [User],

  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  debug: true,
  driverOptions: __isProd__
    ? {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : undefined,
} as Parameters<typeof MikroORM.init>[0];
