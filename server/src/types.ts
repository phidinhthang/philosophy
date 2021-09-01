import { EntityManager } from '@mikro-orm/postgresql';
import { Request, Response } from 'express';

export type MyContext = {
  req: Request;
  res: Response;
  em: EntityManager;
};
