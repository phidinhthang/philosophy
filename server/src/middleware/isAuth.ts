import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];
  if (!authorization) {
    throw new Error('not auth');
  }

  try {
    const token = authorization.split(' ')[1];
    if (!token) throw new Error('not auth');

    const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);

    const userId = payload?.userId;

    if (!userId) throw new Error('not auth');

    return next();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
