import { User } from '../../entities/User';
import jwt from 'jsonwebtoken';
import { MyContext } from '../../types';

export const getUserById = async ({
  req,
  em,
}: Omit<MyContext, 'res'>): Promise<User> => {
  const authorization = req.headers['authorization']!;

  const token = authorization.split(' ')[1];
  const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  const userId = payload.userId;

  const user = (await em.findOneOrFail(User, { id: userId })) as User;

  return user;
};
