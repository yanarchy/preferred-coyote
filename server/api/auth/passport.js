var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var DB = require('../../models');
var User = DB.User;
var promise = require('bluebird');

module.exports = function(app) {
  // initialize passport on the app
  app.use(passport.initialize());
  /**
   * Local Strategy
   */
  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('AM I MAKING IT INTO PASSPORT.JS??');

      User.find({
        where: {
          username: username
        }
      }).then(function(user) {

        // there isn't a user return done with false authentication
        if (!user) {
          console.log('no user in passport.js');
          return done(null, false, { message: 'Incorrect username.' });
        }

        // verify the password is correct
        user.comparePasswords(password).then(function(match) {
          console.log('correct password');
          return done(null, user);
        }).catch(function(err) {
          return done(null, false, { message: 'Incorrect password.' });
        });
        
      }).catch(function(err) {
        // there was an error
        if (err) {
          console.log('you erred in passport.js');
          return done(err);
        }

      });

    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

};