import { Response } from 'express';

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  return res.cookie('jid', refreshToken, {
    httpOnly: true,
  });
};
