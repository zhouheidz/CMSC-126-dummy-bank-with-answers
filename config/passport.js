const passport = require('passport');
const TwitterPassport = require('passport-twitter');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookPassport = require('passport-facebook');
const User = require('../models').User;
const Account = require('../models').Account;

passport.use(new FacebookPassport({
    clientID: '273559783109359',
    clientSecret: 'ffa9b4171171a01acc6eba8b07956a00',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: true
}, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ 
        where: {email: profile.id},
        defaults: {password: '', name:profile.displayName} 
    }).then(function (result) {
        Account.findOrCreate({
            where: { user_id: result[0].id},
            defaults: {user_id: result[0].id}
        });
        done(null, result[0]);
      });
}));

passport.use(new GoogleStrategy({
    clientID: '1084488263408-p4k612ctk3mpsulfr9fpskuqde9fvjgp.apps.googleusercontent.com',
    clientSecret: 'N7562kTaTFU8vqdGiE3UIYLF',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
    User.findOrCreate({
        where: { 
            email: profile.emails[0].value,
            name: profile.displayName 
        }, defaults: { 
            password: '' 
        }
    })
      return done(null, profile);
    });
  }
));

passport.use(new TwitterPassport({
    consumerKey: '7mNd39P1eKcfpBF42skNxU6gV',
    consumerSecret: 'ng5453RTqS1ltO7AWyowl53RYk6KMqqRK72gpOq5Plm7QRmME0',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function(token, secret, profile, cb) {
    User.findOrCreate({
        where: { email: profile.username },
        defaults: { password: '' , name:profile.displayName}
    }).then(function(result) {
        Account.findOrCreate({
            where: { user_id: result[0].id},
            defaults: {user_id: result[0].id}
        });
        cb(null, result[0]);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ where: { id: id } }).then(function(user) {
        done(null, user);
    });
});

module.exports = passport;
