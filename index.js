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



/*
	this function redirects the user to the profile page. 
	The following limitations / notes includes:
		- There must be an internet connection and server must be running
		- User must have signed up or User is found in the database.
		- GET method only retrieves data. Hence, no data is being modified. If there is a need for data modification
			on this routine, a POST method should be done.
*	@param {string} '/profile' - the profile route
*	@param {function} requireSignedIn - checks whether the user has already signed in
*	@param {req} req - The HTTP request object
*	@param {res} res - The HTTP response object
*/
app.get('/profile', requireSignedIn, function(req, res) {
	var balance = '';
	const email = req.user;
	var header = '';

	/*
		This subfunction below simply finds who is the current user in order to display the name in the profile
		Limitations / reminders include:
			- there will always be an email here.
	*	@param {User} user - a User object returned by a database query
	*/
	User.findOne({ where: { email: email } }).then(function(user) {
		if(user.name) {
			header = user.name;
		} else {
			header = req.user;
		}
		/**
		*	@param {Account} userAccount - an Account object returned by a database query
		*/
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

	Following notes / limitations include:
		- This function displays a numerical value (balance) of the user if the transfer
			was successful.
		- Function is expected to work if the receiver of the transfer exists (in the database)
			AND the balance of the sender is sufficient enough to transfer the said amount.
		- If the transfer was unsuccessful, it will display a string with a corresponding
			error: 
				- Insufficient funds if balance is insufficien
				- Non-existent user if the receiver does not exist in the database.
*	@param {string} '/transfer' - the route to transfer a user after a transaction
*	@param {function} requireSignedIn - checks whether the user has already signed in
*	@param {req} req - The HTTP request object
*	@param {res} res - The HTTP response object
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
	

	/**
	*	@param {User} recipient - a User object of the receiver account
	*	@param {boolean} result - returns true if the User is existing, otherwise, false
	*/
	existingUser(recipient, function(result) {
		if(result == true) {
			if(validAmount(amount) == true){	
				/**
				*	@param {User} results - returns a User object after a database query
				*	@param {User} results2 - returns a User object after a database query
				*/
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

	 Limitations / Notes:
	 	- Function displays the user balance (numerical value) if the deposit function worked successfully
	 	- The function will work properly if:
	 		- The amount is valid (e.g. Positive amount)
	 		- The user exists (is in the database)
	 	- A string is expected to be displayed if the function fails.
*	@param {string} '/deposit' - the route to the deposit page
*	@param {function} requireSignedIn - checks whether the user has already signed in
*	@param {req} req - The HTTP request object
*	@param {res} res - The HTTP response object
*/
app.post('/deposit', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, 10);
	const email = req.user;
	
	if(validAmount(amount)) {
		/**
		*	@param {string} email - contains the email address of the current user
		*	@param {int} userBalance - the balance remaining in a User's bank account
		*	@param {Account} userAccount - an Account object returned by a database query
		*/
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

	Limitations / Notes
	 	- The routine shows the user balance (numerical value) if the withdraw was successful.
	 	- The function will work properly if:
	 		- The amount is valid (e.g. Positive amount)
	 		- The user balance is sufficient enough to withdraw the said amount.
	 		- The user exists in the database.
	 	- A string is expected to be displayed if the function fails:
	 		- 'Insufficient Amount' is displayed if the balance is insufficient for withdrawal.
	 		- 'Amount should be greater than zero' if the said amount is a negative number.
*	@param {string} '/withdraw' - the route to the withdraw page
*	@param {function} requireSignedIn - checks whether the user has already signed in
*	@param {req} req - The HTTP request object
*	@param {res} res - The HTTP response object
*/
app.post('/withdraw', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, 10);
	const email = req.user;

	if(validAmount(amount)){		
		/**
		*	@param {string} email - contains the email address of the current user
		*	@param {int} userBalance - the balance remaining in a User's bank account
		*	@param {Account} userAccount - an Account object returned by a database query
		*/
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

/*
	This is a function call to return the userbalance and useraccount given the email.

	Limitations / Notes:
		- The callback function returns the balance and user details if the user is found.
		- Expected to return and empty string for the balance if user is not found.
		- email parameter should not be null or non-existent for this routine to work as it is.
*	@param {string} email - contains the email address of the current user
*	@param {function} callback - returns true if User exists, false otherwise
*/
function getUserDetails(email, callback) {
	var balance = '';
	var localUserBalance = '';
	/**
	*	@param {User} user - a User object returned after a database query
	*	@param {Account} userAccount - an Account object returned after a database query
	*/
	User.findOne({ where: { email: email } }).then(function(user) {
		Account.findOne({ where: { user_id: user.id } }).then(function(userAccount) {
			balance = userAccount.balance;					
			callback(balance,userAccount)
		});
	});
}
/*
	A function call to check if the amount being passed is valid.

	Limitation / Notes:
		- Routine is expected to work on numerical values only.
		- Returns a boolean value.
*	@param {int} amount - the amount to be withdrawn, deposited, or transferred
*/
function validAmount(amount) {
	return amount > 0 ? true : false;
}

/*
	A function call to check if a user exists in the database.

	Limitation / Notes:
		- Routine is expected to work if there is currently a user logged in.
		- Returns a boolean value.
*	@param {User} user - a User object returned after a database query
*	@param {function} callback - returns true if User exists, false otherwise
*/
function existingUser(user, callback) {
	User.findOne({where: {email:user}}).then(function(user2) {
		if(!user2) {
			callback(false);
		} else {
			callback(true);
		}
	})
};

/*
	The requiredSignedIn function simply checks the sessions of the user.

	Limitation / Reminders:
		- If user is not signed in, it will be redirected.
		- If user is indeed signed, it will proceed.
		- If modifications are done and server is restarted, session will be restarted.
*	@param {req} req - The HTTP request object
*	@param {res} res - The HTTP response object
*	@param {next} next - The HTTP next middleware function
*/
function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
