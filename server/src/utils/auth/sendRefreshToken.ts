import { Response } from 'express';
import { __isProd__ } from '../../constants';

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  return res.cookie('jid', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
  });
};
