const bcrypt = require('bcrypt');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;

function initilize(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        console.log('User: ', user);
        if (!user) {
          return done(null, false, { message: 'User not found!' });
        } else if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        }
        return done(null, false, { message: 'Invalid Password' });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initilize;
