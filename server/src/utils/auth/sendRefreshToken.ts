import { Response } from 'express';

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  return res.cookie('jid', refreshToken, {
    httpOnly: false,
    domain: process.env.FRONTEND_NEXTJS_URL,
  });
};
