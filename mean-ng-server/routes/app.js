let express = require('express');
let router = express.Router();

/**
 * Default path
 */
router.get('/', function (req, res, next) {
    // -- This is only for single-place hosting for the frontend; otherwise return a 404
    if (req.baseUrl.startsWith('/auth') || req.isAuthenticated())
        res.render('index');
    else
        res.redirect('/auth/login');
});

module.exports = router;
