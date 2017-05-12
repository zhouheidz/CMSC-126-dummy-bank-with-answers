const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');
const passport = require('./config/passport');
const database = require('./database');
const User = require('./models').User;
const Account = require('./models').Account;
const routes = './routes/auth-routes'; 
const twitter = './routes/twitter';
const facebook = './routes/facebook';
const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', './views');

app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());
app.use(passport.initialize());

app.use('/static', express.static('./static'));
app.use(require(routes));
app.use(require(twitter));
app.use(require(facebook));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/profile', requireSignedIn, function(req, res) {
	const email = req.session.currentUser;
	var ontop = '';
	User.findOne({ where: { email: email } }).then(function(user) {
		if(user.name) {
			ontop = user.name;
		} else {
			ontop = req.session.currentUser;
		}
		res.render('profile.html', {
			user: user, ontop:ontop
		});
	});
});

app.post('/transfer', requireSignedIn, function(req, res) {
	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, 10);

	const email = req.session.currentUser;
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
						req.flash('statusMessage', 'Transferred ' + amount + ' to ' + recipient);
						res.redirect('/profile');
					});
				});
			});
		});
	});
});

app.post('/deposit', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, 10);

	const email = req.session.currentUser;
	User.findOne({ where: { email: email } }).then(function(sender) {
		Account.findOne({ where: { user_id: sender.id } }).then(function(senderAccount) {
			database.transaction(function(t) {
				return senderAccount.update({
					balance: senderAccount.balance + amount
				}, { transaction: t });
			}).then(function() {
				req.flash('statusMessage', 'Deposited ' + amount + ' to ' + email);
				res.redirect('/profile');
			});
		});
	});
});

app.post('/withdraw', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, 10);

	const email = req.session.currentUser;
	User.findOne({ where: { email: email } }).then(function(sender) {
		Account.findOne({ where: { user_id: sender.id } }).then(function(senderAccount) {
			database.transaction(function(t) {
				return senderAccount.update({
					balance: senderAccount.balance - amount
				}, { transaction: t });
			}).then(function() {
				req.flash('statusMessage', 'Withdrew ' + amount + ' to ' + email);
				res.redirect('/profile');
			});
		});
	});
});

function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
