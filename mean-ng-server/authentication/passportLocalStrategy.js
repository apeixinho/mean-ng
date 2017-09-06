// load strategies
let LocalStrategy = require('passport-local').Strategy;

// load the user model
let User = require('../models/user');

// expose this function to our app using module.exports
let passportLocal = function (passport) {

    // REMEMBER ME
    // =========================================================================
    // adjust the session cookie according to the 'remember me' check
    function rememberMe(req) {
        if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
        } else {
            req.session.cookie.expires = false; // Cookie expires at end of session
        }
    }

    // SESSION SERIALIZATION
    // =========================================================================
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (_id, done) {
        User.findById(_id)
            .then(user => done(null, user))
            .catch(err => done(err, null));
    });

    // LOCAL REGISTER
    // =========================================================================
    passport.use('local-register', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({
                    'auth.local.email': email
                })
                .then(user => {
                    if (user) {
                        return done(null, null, new Error('Email is already registered.'));
                    }

                    let newUser = new User();
                    newUser.auth.local.email = email;
                    newUser.auth.local.password = newUser.generateHash(password); // hash the password before saving                    
                    newUser.contactInfo.email = email;
                    newUser.generalInfo.fullName = req.body['fullName'];

                    newUser.save()
                        .then(result => {
                            rememberMe(req);

                            // On successful registration log in the new user 
                            req.logIn(newUser, err => {
                                return done(err, newUser);
                            });
                        })
                        .catch(error => {
                            return done(error);
                        });
                })
                .catch(error => {
                    return done(error);
                });
            Error
        }
    ));

    // LOCAL LOGIN
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({
                    'auth.local.email': email
                })
                .then(user => {
                    if (!user || !user.validPassword(password)) {
                        return done(null, false, new Error('Invalid login credentials.'));
                    }

                    rememberMe(req);

                    // perform the log-in (necessary since we're not using the default passport name)
                    req.logIn(user, err => {
                        return done(err, user);
                    });
                })
                .catch(error => {
                    return done(error);
                });

        }));

    // LOCAL PASSWORD RESET
    // =========================================================================
    passport.use('local-password-reset', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            let token = req.params['token'];
            User.findOne({
                    'auth.local.resetPassword.token': token,
                    'auth.local.resetPassword.expire': {
                        $gt: Date.now()
                    }
                })
                .then(user => {
                    if (!user) {
                        return done(null, false, new Error('Password reset token expired or not found.'));
                    }
                    user.update({
                            'auth.local.password': user.generateHash(password),
                            'auth.local.resetPassword': null
                        })
                        .exec()
                        .then(user => {
                            return done(null, user)
                        })
                        .catch(error => {
                            return done(error)
                        });
                })
                .catch(error => {
                    return done(error);
                })
        }));
}

module.exports = passportLocal;