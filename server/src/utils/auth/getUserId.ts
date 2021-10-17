import { MyContext } from '../../types';
import jwt from 'jsonwebtoken';

export const getUserId = (
  req: Pick<MyContext, 'req'>['req'],
): string | undefined => {
  const authorization = req.headers['authorization'];
  if (!authorization) throw new Error('not auth');
  const token = authorization.split(' ')?.[1];
  if (!token) return;
  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return payload?.userId as string;
  } catch (err) {
    console.log(err);
    return;
  }
};
