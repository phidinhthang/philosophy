import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Application } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from './entities/User';
import { v4 } from 'uuid';
import { createRefreshToken } from './utils/auth/createToken';
// import { sendRefreshToken } from './utils/auth/sendRefreshToken';
// import { createRefreshToken } from './utils/auth/createToken';

export const configPassport = ({
  app,
  em,
}: {
  app: Application;
  em: EntityManager;
}) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.CALLBACK_URL!,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        console.log('profile ', profile);
        console.log('avatar', profile.photos?.[0].value);
        try {
          let user = await em.findOne(User, { googleId: profile.id });
          if (!user) {
            user = em.create(User, {
              id: v4(),
              googleId: profile.id,
              name: profile.displayName,
              firstName: profile.name?.givenName || profile.displayName,
              lastName: profile.name?.familyName || ' ',
              avatarUrl: profile.photos?.[0].value,
            });
            await em.persistAndFlush(user);
          }
          return done(null, user);
        } catch (err) {
          console.log(err);
          return done(err, null);
        }
      },
    ),
  );

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/userinfo.profile'],
    }),
  );

  app.get('/auth/google/callback', function (req, res, next) {
    console.log('hello 1');
    passport.authenticate('google', function (err, user, info) {
      console.log('hello');
      console.log('user ', JSON.stringify(user, null, 2));
      console.log('info ', JSON.stringify(info, null, 2));
      if (!user || err)
        return res.redirect(process.env.FRONTEND_NEXTJS_URL + '/login');
      return res.redirect(
        process.env.FRONTEND_NEXTJS_URL +
          `/auth/gg/getToken?refresh_token=${createRefreshToken(user)}`,
      );
    })(req, res, next);
  });

  console.log(process.env.GOOGLE_CLIENT_ID);
  console.log(process.env.GOOGLE_CLIENT_SECRET);
};
