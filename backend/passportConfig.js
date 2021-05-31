const User = require('./user')                              // User Schema
const bcrypt = require('bcryptjs')                          // Un-hash passwords
const localStrategy = require('passport-local').Strategy;   // Passport authentication method

// Pass in the passport library, because we want to use the same INSTANCE of passport throughout entire application
module.exports = function(passport){

    // Defining local strategy for passport, so that everytime we use local strategy throughout application, it will run THIS definition
    passport.use(
        // loginusername and loginpassword from req.body (HTTP request of User filling in the Login form)
        // done is CALLBACK FUNCTION, signifies what we want to do after everything is done
        new localStrategy((loginUsername,loginPassword, callbackDone) => {
            // Lookup User in the database, by attempting to match loginusername to database's store
            // Note the user of comma operator also!
            User.findOne( {username : loginUsername}, (error,user) => {
                if (error) throw error;
                if (!user) return callbackDone(null, false)   // null is the error (we have no error), false is the user (there is no user)
                else {
                    // Compare loginpassword with database password, then do your projections
                    bcrypt.compare(loginPassword, user.password, (error, result) => {
                        if (error) throw error;
                        if (result === true) { return callbackDone(null, user) }
                        else {return callbackDone(null , false)}
                    })
                }
            })
        })
    )

    // Takes in user object from Local Strategy, produces a UNIQUE KEY that corresponds to it, and saves it in session (as a cookie)
    // This key will be used to retrieve the ENTIRE user object, later on in deserializeUser
    passport.serializeUser((user,callbackDone) => {
        callbackDone(null, user.id)   // Result of serializeUser is user.id, which is stored in req.session.passport.user = {id : .... }
    })

    // Takes in UNIQUE KEY, and retrieves ENTIRE user object
    // id in deserializeUser is exactly user.id in serializeUser
    passport.deserializeUser((id, callbackDone) => {
        User.findOne( {_id : id}, (error,user) => {    // UNIQUE _id field for EVERY object in mongoDB acts as primary key
            callbackDone(error, user)   // User object attaches to the session request as req.user.
                                        // Note that if there is error, we will still capture it (by the comma operator)
        })
    })
}