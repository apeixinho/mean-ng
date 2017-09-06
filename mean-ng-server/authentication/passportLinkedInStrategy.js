// load strategies
let LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

// load the user model
let User = require('../models/user');

// expose this function to our app using module.exports
let passportLinkedIn = function (passport) {

    // LINKEDIN LOGIN
    // =========================================================================
    passport.use(new LinkedInStrategy({
            // spell-checker:disable
            clientID: process.env.LINKEDIN_API_KEY, // In .env: LINKEDIN_API_KEY=XXXXXXXXXXXXXX
            clientSecret: process.env.LINKEDIN_SECRET_KEY, // In .env: LINKEDIN_SECRET_KEY=XXXXXXXXXXXXXXXX
            callbackURL: process.env.LINKEDIN_CALLBACK_URL, // In .env: LINKEDIN_CALLBACK_URL=https://localhost:3443/api/v1/user/linkedin/callback
            scope: ['r_emailaddress', 'r_basicprofile']
            // spell-checker:enable
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({
                        'auth.linkedin.id': profile.id
                    })
                    .then(user => {
                        if (user) {
                            user.generalInfo.pictureUrl = profile.photos[0].value;
                            user.save()
                                .then(user => {
                                    // On successful login update the user info 
                                    return done(null, user);
                                })
                                .catch(error => {
                                    return done(error);
                                });
                        } else {
                            let liEmail = profile.emails ? profile.emails[0].value : null;
                            User.findOne({
                                    'auth.local.email': liEmail
                                }).then(user => {
                                    if (user) {
                                        user.auth.linkedin.id = profile.id; // set the users facebook id                   
                                        user.auth.linkedin.token = token; // we will save the token that facebook provides to the user                    
                                        user.generalInfo.pictureUrl = profile.photos[0].value;
                                        user.save()
                                            .then(user => {
                                                // On successful registration log in the new user 
                                                return done(null, user);
                                            })
                                            .catch(error => {
                                                return done(error);
                                            });
                                    } else {
                                        let newUser = new User();

                                        newUser.auth.linkedin.id = profile.id; // set the users linkedin id                   
                                        newUser.auth.linkedin.token = token; // we will save the token that linkedin provides to the user                    
                                        newUser.contactInfo.email = newUser.auth.linkedin.email = liEmail; // linkedin can return multiple emails so we'll take the first
                                        newUser.generalInfo.fullName = newUser.auth.linkedin.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                                        newUser.generalInfo.pictureUrl = profile.photos[0].value;

                                        // save our user to the database
                                        newUser.save()
                                            .then(user => {
                                                // On successful registration log in the new user 
                                                return done(null, user);
                                            })
                                            .catch(error => {
                                                return done(error);
                                            });
                                    }
                                })
                                .catch(error => {
                                    return done(error);
                                });
                        }
                    })
                    .catch(error => {
                        return done(error);
                    });
            });
        }
    ));
}

module.exports = passportLinkedIn;