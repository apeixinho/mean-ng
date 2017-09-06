let express = require('express');
let router = express.Router();
let passport = require('passport');
let passwordRecovery = require('../../authentication/passwordRecovery');
let response = require('../_response');

/**
 * 
 * @api {post} /auth/login Login
 * @apiName login
 * @apiGroup Authentication
 * @apiVersion 0.0.1
 * 
 * @apiParam  {String} email User's login email
 * @apiParam  {String} password User's login password
 * @apiParam  {Boolean} [remember=false] If true then persist the saved cookie beyond the session (remember me)
 *
 * @apiParamExample  {json} Request-Example:
      {
        "email": "stephen@company.com",
        "password": "123456",
        "remember": true
      }
 * 
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "obj": { "name": "Stephen Smith", "imageUrl": "" },
 *      "id": "123456ABCDEF"
 *    }
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 403 Unauthorized
      {
       "message": "Invalid login credentials."
      }
 * 
 */
router.post('/login', function (req, res, next) {
  passport.authenticate('local-login', function (err, user, info) {
    if (user) response.ok(res, response.HTTPStatus.CREATED, {
      obj: {
        name: user.generalInfo.formattedName,
        pictureUrl: user.generalInfo.pictureUrl
      },
      id: user._id.toString()
    });
    else if (err) response.error(res, response.HTTPStatus.INTERNAL_SERVER_ERROR, err);
    else response.error(res, response.HTTPStatus.UNAUTHORIZED, info);
  })(req, res, next);
});

/**
 * 
 * @api {post} /auth/register Register
 * @apiName register
 * @apiGroup Authentication
 * @apiVersion  0.0.1
 * 
 * @apiParam  {String} email User's email
 * @apiParam  {String} password User's password
 * @apiParam  {String} fullName User's full name
 * 
 * @apiParamExample  {json} Request-Example:
      {
        "email": "stephen@company.com",
        "password": "123456",
        "fullName": "Stephen A. Smith",
      }
 * 
 * 
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 201 Created
 *    {
 *      "obj": { "name": "Stephen A. Smith", "imageUrl": null },
 *      "id": "123456ABCDEF"
 *    }
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 409 Conflict
      {
        "message": "Email is already registered."
      }
 * 
 */
router.options('/register');
router.post('/register', function (req, res, next) {
  passport.authenticate('local-register', function (err, user, info) {
    if (user) response.ok(res, response.HTTPStatus.CREATED, {
      obj: {
        name: user.generalInfo.formattedName,
        imageUrl: user.generalInfo.pictureUrl
      },
      id: user._id.toString()
    });
    else if (err) response.error(res, response.HTTPStatus.INTERNAL_SERVER_ERROR, err);
    else response.error(res, response.HTTPStatus.CONFLICT, info); // email is already registered
  })(req, res, next);
});

/**
 * 
 * @api {get} /auth/password Password recovery
 * @apiName passwordRecover
 * @apiGroup Authentication
 * @apiVersion 0.0.1
 * @apiDescription
 * Generate an internal server hosted temporary token and send a recovery email to the user.
 * If the email address is valid this will send an email to the requesting party with a link to a 
 * password reset page.
 * 
 * Note: due to security consideration, even if the email is not in the system the user will receive a successful (2XX) response.
 * 
 * @apiParam  {String} email User's recovery email (same as login email)
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 202 Accepted
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 500 Internal Server Error
      {
       "message": "Mailer failed to send email."
      }
 * 
 */
router.get('/password', function (req, res) {
  passwordRecovery.recover(req, function (err) {
    if (!err) response.ok(res, response.HTTPStatus.ACCEPTED);
    else response.error(res, response.HTTPStatus.INTERNAL_SERVER_ERROR, err);
  });
});

/**
 * 
 * @api {post} /auth/password/:token Password reset
 * @apiName passwordReset
 * @apiGroup Authentication
 * @apiVersion 0.0.1
 * @apiDescription
 * Request a new password for an account using a temporary token produced by <a href="#api-Authentication-passwordRecover">password recovery</a>.
 *  
 * @apiParam  {String} token The temporary token produced by <a href="#api-Authentication-passwordRecover">password recovery</a>.
 * @apiParam  {String} password A new password.
 * 
 * @apiParamExample  {json} Request-Example:
      {
        "password": "98765"
      }
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 * 
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 403 Unauthorized
      {
       "message": "Password reset token expired or not found."
      }
 * 
 */
router.post('/password/:token', function (req, res) {
  passwordRecovery.reset(req, function (err) {
    if (!err) response.ok(res);
    else response.error(res, response.HTTPStatus.UNAUTHORIZED, err);
  });
});

/**
 * 
 * @api {get} /auth/linkedin LinkedIn Login/Register
 * @apiName linkedin
 * @apiGroup Authentication
 * @apiVersion  0.0.1
 * @apiDescription
 * Login or register a user using a LinkedIn OAuth2 authentication.
 * This returns a token that is then funneled to the <a href="#api-Authentication-linkedinCallback">callback</a> for user processing.
 * 
 */
router.get('/linkedin', passport.authenticate('linkedin'));

/**
 * 
 * @api {get} /auth/linkedin/callback LinkedIn Callback
 * @apiName linkedinCallback
 * @apiGroup Authentication
 * @apiVersion  0.0.1
 * @apiDescription
 * A callback command for the LinkedIn OAuth2 authentication.
 * This will perform login or registration of the user and redirect to the frontend URL.
 * If successful the main frontend page will be called where the login is validated and corresponding presentation is made
 * If unsuccessful the command will redirect to the frontend URL with <code>/auth/login</code> appended. 
 * 
 */
router.get('/linkedin/callback', function (req, res, next) {
  passport.authenticate('linkedin', {
    failureRedirectY: process.env.FRONTEND_URL + '/auth/login'
  }, function (err, user) {
    if (!user) res.redirect(process.env.FRONTEND_URL + '/auth/login');
    else {
      req.logIn(user, () => {
        res.redirect(process.env.FRONTEND_URL + '/auth/login?id=' + user._id.toString() + '&name=' + user.generalInfo.formattedName + '&pictureUrl=' + user.generalInfo.pictureUrl);
      });
    }
  })(req, res, next);
});

/**
 * 
 * @api {get} /auth/facebook Facebook Login/Register
 * @apiName facebook
 * @apiGroup Authentication
 * @apiVersion  0.0.1
 * @apiDescription
 * Login or register a user using Facebook authentication.
 * This returns a token that is then funneled to the <a href="#api-Authentication-facebookCallback">callback</a> for user processing.
 * 
 */
router.get('/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

/**
 * 
 * @api {get} /auth/facebook/callback Facebook Callback
 * @apiName facebookCallback
 * @apiGroup Authentication
 * @apiVersion  0.0.1
 * @apiDescription
 * A callback command for the Facebook OAuth2 authentication.
 * This will perform login or registration of the user and redirect to the frontend URL.
 * If successful the main frontend page will be called where the login is validated and corresponding presentation is made
 * If unsuccessful the command will redirect to the frontend URL with <code>/auth/login</code> appended. 
 * 
 */
router.get('/facebook/callback', function (req, res, next) {
  passport.authenticate('facebook', {
    failureRedirectY: process.env.FRONTEND_URL + '/auth/login'
  }, function (err, user) {
    if (!user) res.redirect(process.env.FRONTEND_URL + '/auth/login');
    else {
      req.logIn(user, () => {
        res.redirect(process.env.FRONTEND_URL + '/auth/login?id=' + user._id.toString() + '&name=' + user.generalInfo.formattedName + '&pictureUrl=' + user.generalInfo.pictureUrl);
      });
    }
  })(req, res, next);
});

/**
 * 
 * @api {get} /auth/logout Logout
 * @apiName logout
 * @apiGroup Authentication
 * @apiVersion  0.0.1
 * @apiDescription
 * Log the user out of the system.
 * 
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 * 
 */
router.get('/logout', function (req, res) {
  req.logout();
  response.ok(res);
});

module.exports = router;