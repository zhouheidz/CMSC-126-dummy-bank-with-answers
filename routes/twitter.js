const express = require('express');
const User = require('../models').User;
const Account = require('../models').Account;
const passport = require('../config/passport');
const router = new express.Router();

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/'
    }),
    function(req, res) {
        req.session.currentUser = req.user.email;
        res.redirect('/profile');
    }
);

module.exports = router;
