const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { findUser, comparePassword } = require('./users');

function initializePassport(passport) {
  // Local Strategy for username/password authentication with bcrypt
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = findUser(username);
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      // Comparer le mot de passe avec bcrypt
      const isMatch = await comparePassword(password, user.password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize/Deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    const user = findUserById(id);
    done(null, user);
  });

}//end initializePassport()


function findUserById(id) {
  const { users } = require('./users');
  return users.find(user => user.id === id);
}


function isAuthorizedUser(login) {
  const authorizedUsers = ["sud", "smart", "sesnum", "data", "aseds", "amoa"];
  if (authorizedUsers.includes(login))
     return true;
  return false;
}//isAuthorizedUser()

//Other security services to be added here

module.exports = { isAuthorizedUser, initializePassport };