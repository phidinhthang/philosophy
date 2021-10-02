import { Options } from '@mikro-orm/core';
import { __isProd__ } from '../constants';
import path from 'path';
import { User } from '../entities/User';
import { Complete } from '../entities/Complete';
import { Exercise } from '../entities/Exercise';
import { Answer } from '../entities/Answer';
import { Question } from '../entities/Question';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ScorePerDay } from '../entities/ScorePerDay';
import { SavedExercise } from '../entities/SavedExercise';

export default {
  migrations: {
    path: path.join(__dirname, '../migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    disableForeignKeys: false,
  },
  entities: [
    User,
    Exercise,
    Complete,
    Question,
    Answer,
    ScorePerDay,
    SavedExercise,
  ],

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
  tsNode: true,
} as Options<PostgreSqlDriver>;
