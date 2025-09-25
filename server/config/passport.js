const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { query } = require('../db/database');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const googleId = profile.id;
    const name = profile.displayName;
    const picture = profile.photos[0].value;

    // Check if user already exists with this Google ID
    let result = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);

    if (result.rows.length > 0) {
      // User exists with Google ID
      return done(null, result.rows[0]);
    }

    // Check if user exists with this email (for account linking)
    result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      // User exists with email, link Google account
      const updatedUser = await query(
        'UPDATE users SET google_id = $1, google_picture = $2, name = $3, updated_at = CURRENT_TIMESTAMP WHERE email = $4 RETURNING *',
        [googleId, picture, name, email]
      );
      return done(null, updatedUser.rows[0]);
    }

    // Create new user
    const newUser = await query(
      'INSERT INTO users (email, google_id, name, google_picture, email_verified, created_at, updated_at) VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [email, googleId, name, picture]
    );

    return done(null, newUser.rows[0]);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;