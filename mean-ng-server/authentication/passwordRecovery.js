let async = require('async');
let crypto = require('crypto');

let mailer = require('../notifications/mailer');

// load the user model
let User = require('../models/user');

module.exports.recover = (req, done) => {
    const email = req.query.email;
    if (!email) return done(new Error('Missing email parameter.'));

    async.waterfall([

            // Create a token
            function (cb) {
                crypto.randomBytes(20, function (err, buf) {
                    let token = buf.toString('hex');
                    cb(err, token);
                });
            },

            // find the user requesting password recovery
            function (token, cb) {
                User.findOneAndUpdate({
                        'auth.local.email': email
                    }, {
                        'auth.local.resetPassword': {
                            'token': token,
                            'expire': Date.now() + 3600000 // 1 hour
                        }
                    }, {
                        new: true
                    })
                    .exec()
                    .then(user => {
                        if (!user) {
                            // If email is not in the system the user will still get a 202 (success) since error is set to null
                            return done(new Error('Email not found.'));
                        }

                        cb(null, token, user);
                    })
                    .catch(err => {
                        return done(err);
                    });
            },

            // send and email with a link to reset password
            function (token, user, cb) {

                // frontend url to the reset password page
                const link = process.env.FRONTEND_URL + '/auth/resetpassword/' + token;

                const body = `
                You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                    link +
                    `\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n` +
                    (process.env.SUPPORT_SIGNATURE ? `\n\nRegards,\n` + process.env.SUPPORT_SIGNATURE : ``);

                console.log('Password reset link: ' + link);

                mailer.sendMail(process.env.SUPPORT_EMAIL, email, 'Account Action', body)
                    .then(info => done(null))
                    .catch(err => done(err));
            }
        ],

        function (err) {
            if (err) return done(err);
        });
}

module.exports.reset = (req, done) => {
    const token = req.params['token'];
    const password = req.body['password'];

    User.findOne({
            'auth.local.resetPassword.token': token,
            'auth.local.resetPassword.expire': {
                $gt: Date.now()
            } // tokens are given a now + 1 hour expiration time
        })
        .then(user => {
            if (!user) {
                return done(new Error('Password reset token expired or not found.'));
            }
            user.update({
                    'auth.local.password': user.generateHash(password),
                    'auth.local.resetPassword': null
                })
                .exec()
                .then(user => {
                    return done(null);
                })
                .catch(error => {
                    return done(error);
                });
        })
        .catch(error => {
            return done(error);
        })
}