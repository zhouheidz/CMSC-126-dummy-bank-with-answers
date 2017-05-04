const bcrypt = require('bcrypt');
const express = require('express');
const User = require('./models').User;

const router = new express.Router();

router.post('/signup', function(req, res) {
	const email = req.body.email;
    const password = req.body.password;
    const confirmation = req.body.confirmation;

	User.findOne({ where: { email: email } }).then(function(user) {
        if (user !== null) {
            console.log('Email is already in use.');
            return res.redirect('/');
        }
		if (password !== confirmation) {
	        console.log('Passwords do not match.');
	        return res.redirect('/');
	    }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        User.create({
            email: email,
            password: hashedPassword,
            salt: salt
        }).then(function() {
            console.log('Signed up successfully!');
            return res.redirect('/');
        });
    });
});

router.post('/signin', function(req, res) {
	const email = req.body.email;
    const password = req.body.password;

	User.findOne({ where: { email: email } }).then(function(user) {
        if (user === null) {
            console.log('Incorrect email.');
            return res.redirect('/');
        }

		const match = bcrypt.compareSync(password, user.password);
		if (!match) {
			console.log('Incorrect password.');
			return res.redirect('/');
		}

		console.log('Signed in successfully!');
		res.cookie('currentUser', user.email, { signed: true });
		res.redirect('/profile');
    });
});

router.get('/signout', function(req, res) {
	res.clearCookie('currentUser');
	res.redirect('/');
});

module.exports = router;
