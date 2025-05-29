
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: '664241308488-vgggfqa6p5d3dheelhe2n03bkpon64ki.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
     
      const userData = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value
    };
     
     

    return done(null, userData);
    }
  )
);
