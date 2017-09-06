// load strategies
let FacebookStrategy = require('passport-facebook').Strategy;

// load the user model
let User = require('../models/user');

// expose this function to our app using module.exports
let passportFacebook = function (passport) {

    // FACEBOOK LOGIN
    // =========================================================================
    passport.use(new FacebookStrategy({
            // spell-checker:disable
            clientID: process.env.FACEBOOK_APP_ID, // In .env: FACEBOOK_APP_ID=XXXXXXXXXXXXXX
            clientSecret: process.env.FACEBOOK_APP_SECRET, // In .env: FACEBOOK_APP_SECRET=XXXXXXXXXXXXXXXX
            callbackURL: process.env.FACEBOOK_CALLBACK_URL, // In .env: FACEBOOK_CALLBACK_URL=https://localhost:3443/api/v1/user/facebook/callback
            profileFields: ['id', 'name', 'emails']
            // spell-checker:enable
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                const pictureUrl = 'http://graph.facebook.com/' + profile.id + '/picture?type=normal';
                User.findOne({
                        'auth.facebook.id': profile.id
                    })
                    .then(user => {
                        if (user) {
                            user.generalInfo.pictureUrl = pictureUrl;
                            user.save()
                                .then(user => {
                                    // On successful login update the user info 
                                    return done(null, user);
                                })
                                .catch(error => {
                                    return done(error);
                                });
                        } else {
                            let fbEmail = profile.emails ? profile.emails[0].value : null;
                            User.findOne({
                                    'auth.local.email': fbEmail
                                })
                                .then(user => {
                                    if (user) {
                                        user.auth.facebook.id = profile.id; // set the users facebook id                   
                                        user.auth.facebook.token = token; // we will save the token that facebook provides to the user                    
                                        user.generalInfo.pictureUrl = pictureUrl;
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

                                        newUser.auth.facebook.id = profile.id; // set the users facebook id                   
                                        newUser.auth.facebook.token = token; // we will save the token that facebook provides to the user                    
                                        newUser.contactInfo.email = newUser.auth.facebook.email = fbEmail; // facebook can return multiple emails so we'll take the first
                                        newUser.generalInfo.fullName = newUser.auth.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                                        newUser.generalInfo.pictureUrl = pictureUrl;

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

module.exports = passportFacebook;