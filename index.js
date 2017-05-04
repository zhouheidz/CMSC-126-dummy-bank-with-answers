const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const consolidate = require('consolidate');
const bcrypt = require('bcrypt');
const database = require('./database');
const User = require('./models').User;
const Account = require('./models').Account;

const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', './views');

app.use(bodyparser.urlencoded());
app.use(cookieparser());

app.use('/static', express.static('./static'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/signup', function(req, res) {
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

app.post('/signin', function(req, res) {
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
		res.cookie('currentUser', user.email);
		res.redirect('/profile');
    });
});

app.get('/signout', function(req, res) {
	res.clearCookie('currentUser');
	res.redirect('/');
});

app.get('/profile', function(req, res) {
	const email = req.cookies.currentUser;
	User.findOne({ where: { email: email } }).then(function(user) {
		res.render('profile.html', {
			user: user
		});
	});
});

app.post('/transfer', function(req, res) {
	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, 10);

	const email = req.cookies.currentUser;
	User.findOne({ where: { email: email } }).then(function(sender) {
		User.findOne({ where: { email: recipient } }).then(function(receiver) {
			Account.findOne({ where: { user_id: sender.id } }).then(function(senderAccount) {
				Account.findOne({ where: { user_id: receiver.id } }).then(function(receiverAccount) {
					database.transaction(function(t) {
						return senderAccount.update({
							balance: senderAccount.balance - amount
						}, { transaction: t }).then(function() {
							return receiverAccount.update({
								balance: receiverAccount.balance + amount
							}, { transaction: t });
						});
					}).then(function() {
						console.log('Transferred ' + amount + ' to ' + recipient);
						res.redirect('/profile');
					});
				});
			});
		});
	});
});

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
