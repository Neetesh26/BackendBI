import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getEnv } from "../shared/utils";
import { createUser, findByCondition } from "../repository/users.repository";

passport.use(
  new GoogleStrategy(
    {
      clientID: getEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
      callbackURL: getEnv("GOOGLE_CALLBACK_URL"),
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(null, false);

        let user = await findByCondition({ email });

        if (!user) {
          user = await createUser({
            email,
            googleId: profile.id,
            isverified: true,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user._id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await findByCondition({ _id: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;