const express = require('express');
const app = express();
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
const google = './routes/google';

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
app.use(require(google));

app.get('/', function(req, res) {
	res.render('index.html');
});

//the retrieveSignedInUser retrieves the current user that is signed-in in the app.
var user = function retrieveSignedInUser(req, res, next) {
	req.user = req.session.currentUser;
	next();
}

app.use(user);


//this function redirects the user to the profile page
app.get('/profile', requireSignedIn, function(req, res) {
	var balance = '';
	const email = req.user;
	var header = '';

	//the function below simply finds who is the current user inorder to display the name in the profile
	User.findOne({ where: { email: email } }).then(function(user) {
		if(user.name) {
			header = user.name;
		} else {
			header = req.user;
		}
		Account.findOne({ where: { user_id: user.id } }).then(function(userAccount) {
			balance = userAccount.balance;
			res.render('profile.html', {
				user: user, 
				header:header, 
				balance:balance
			});
		});
	});
});

/*
this function is for withdrawing money from the user's account
 Refactored:
 	- Added additional checking
 		- validAmount(amount) which checks if the amount to be withdrawed is a value greater than 0.
 		- check if account has sufficient balance
 	- Minimized nested queries
 		- Improved readability of code by using direct queries instead of Sequelized queries
*/
app.post('/transfer', requireSignedIn, function(req, res) {
	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, 10);
	const email = req.session.currentUser;
	var userAmount;
	var recAmount;
	var id1;
	var id2;

	const q1 = "SELECT user_id, balance FROM accounts WHERE user_id in (SELECT id FROM users WHERE email ='" +email+ "');";
	const q2 = "SELECT user_id, balance FROM accounts WHERE user_id in (SELECT id FROM users WHERE email ='" +recipient+ "');";	
	console.log("existingUser = "+existingUser(recipient))
	
	existingUser(recipient, function(result) {
		if(result == true) {
			console.log("USER EXISTS NOW CHECKING IF AMOUNT IS VALID")
			if(validAmount(amount) == true){	
				database.query(q1, { model: User }).spread(function (results) {
					database.query(q2, {model:User}).spread(function (results2) {
						id1 = parseInt(results.get('user_id'));
						id2 = parseInt(results2.get('user_id'));
						userAmount = parseInt(results.get('balance'));
						recAmount = parseInt(results2.get('balance'));
						var userId = (results.get('user_id'));
						var userBalance = results.get('balance');
						var recId = results2.get('user_id');
						var recBalance = results2.get('balance');

						var sufficientBalance = userBalance > amount ? true : false;
						if(sufficientBalance) {
						
							userBalance = userBalance - amount;
							recBalance = recBalance + amount;
							var q3 = "UPDATE accounts SET balance =" + userBalance + "where user_id = " +userId + ";"; 
							var q4 = "UPDATE accounts SET balance =" + recBalance + "where user_id = " +recId + ";" 
							database.query(q3, { model: Account }).then(function (result3) {
								database.query(q4, {model: Account}).then(function (result4) {
									req.flash('userbalance', 'Balance for ' + id1 +  ' should be ' + (userAmount - amount));
									req.flash('recbalance', 'Balance for ' + id2 +  ' should be ' + (recAmount + amount));
									req.flash('actualuserbalance', 'Balance in ' + id1 +  ' is ' + userBalance);
									req.flash('actualrecbalance', 'Balance in ' + id2 +  ' is ' + recBalance);
									req.flash('transfermsg', 'Transferred ' + amount + ' to ' + recipient);
									res.redirect('/profile');	
								})
							})
						} else {
							req.flash('transfermsg', 'Insufficient funds');
							res.redirect('/profile');	
						}
					})
				})
			} else {
				req.flash('transfermsg', 'Insufficient funds');
				res.redirect('/profile');	
			}
		} else {
			req.flash('transfermsg', 'Nonexistent user');
			res.redirect('/profile');	
		}
	})


});

/*
this function is for depositing money to the account of the user.
 Refactored:
 	- Added additional checking
 		- validAmount(amount) which checks if the amount to be withdrawed is a value greater than 0.
 	- Created a routine that retrieves the user balance, which is used in withdraw and deposit.
*/
app.post('/deposit', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, 10);
	const email = req.user;
	
	if(validAmount(amount)) {
		getUserDetails(email, function(userBalance, userAccount){
			database.transaction(function(t){
				return userAccount.update({
					balance: userAccount.balance + amount
				}, {
					 transaction: t 
				});
			}).then(function() {
				req.flash('actualbaldeposit', 'Balance should be '+ (userBalance + amount));
				req.flash('depositmsg', 'Deposited ' + amount + ' to ' + email);
				res.redirect('/profile');
			});
		});
	}else {
		req.flash('depositmsg', 'Amount should be greater than zero');
		res.redirect('/profile');
	}
	
});

/*
this function is for withdrawing money from the user's account
 Refactored:
 	- Added additional checking
 		- validAmount(amount) which checks if the amount to be withdrawed is a value greater than 0.
 		- check if account has sufficient balance
 	- Created a routine that retrieves the user balance, which is used in withdraw and deposit.
*/
app.post('/withdraw', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, 10);
	const email = req.user;

	if(validAmount(amount)){		
		getUserDetails (email, function (userBalance, userAccount){
			var sufficientBalance = userBalance > amount? true : false;
			if(sufficientBalance){
				database.transaction(function(t) {
					return userAccount.update({
						balance: userAccount.balance - amount
					}, { 
						transaction: t 
					});
				}).then(function() {
					req.flash('actualbalwithdraw', 'Balance should be '+ (userBalance - amount));				
					req.flash('withdrawmsg', 'Withdrew ' + amount + ' to ' + email);
					res.redirect('/profile');
				});	
			}else{
				req.flash('withdrawmsg', 'Insufficient amount');
				res.redirect('/profile');
			}
		});
	}else{
		req.flash('withdrawmsg', 'Amount should be greater than zero');
		res.redirect('/profile');
	}	
});

//function call to return the userbalance and useraccount given the email.
function getUserDetails(email, callback) {
	var balance = '';
	var localUserBalance = '';
	User.findOne({ where: { email: email } }).then(function(user) {
		Account.findOne({ where: { user_id: user.id } }).then(function(userAccount) {
			balance = userAccount.balance;					
			callback(balance,userAccount)
		});
	});
}

function validAmount(amount) {
	return amount > 0 ? true : false;
}

function existingUser(user, callback) {
	User.findOne({where: {email:user}}).then(function(user2) {
		if(!user2) {
			callback(false);
		} else {
			callback(true);
		}
	})
};

//the requiredSignedIn function simply checkes the sessions of the
//user (e.g. the user is currently signed-in.)
function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
