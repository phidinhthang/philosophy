import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { sendRefreshToken } from '../utils/auth/sendRefreshToken';

const app = express();
console.log(process.env.FRONTEND_NEXTJS_URL);
app.set('trust proxy', 1);
app.use(
  cors({
    origin:
      process.env.FRONTEND_NEXTJS_URL! ||
      'https://suspicious-franklin-3e4af2.netlify.app/',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get('/', (_req, res) => res.send('hello'));

app.post('/get_refresh_token', (req, res) => {
  const refresh_token = req.body.refresh_token;
  console.log(refresh_token);

  sendRefreshToken(res, refresh_token);
  res.send({ ok: 1 });
});

export { app };
