const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');
const passport = require('passport');
const TwitterPassport = require('passport-twitter');
const database = require('./database');
const User = require('./models').User;
const Account = require('./models').Account;

// Configure PassportJS
passport.use(new TwitterPassport({
    consumerKey: '7mNd39P1eKcfpBF42skNxU6gV',
    consumerSecret: 'ng5453RTqS1ltO7AWyowl53RYk6KMqqRK72gpOq5Plm7QRmME0',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function(token, secret, profile, cb) {
    User.findOrCreate({
        where: { email: profile.username },
        defaults: { password: '' }
    }).then(function(result) {
        cb(null, result[0]);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ where: { id: id } }).then(function(user) {
        done(null, user);
    });
});

const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', './views');

app.use(bodyparser.urlencoded());
app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('./static'));
app.use(require('./auth-routes'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/profile', requireSignedIn, function(req, res) {
	const email = req.session.currentUser;
	User.findOne({ where: { email: email } }).then(function(user) {
		res.render('profile.html', {
			user: user
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

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/'
    }),
    function(req, res) {
        req.session.currentUser = req.user.email;
        res.redirect('/profile');
    }
);

function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
