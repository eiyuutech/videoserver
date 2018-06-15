const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models').users;

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = CONFIG.jwt_encryption;

  passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    let err;
    let user;

    [err, user] = await to(User.findById(jwtPayload.user_id));
    if (err) return done(err, false);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }));
};
