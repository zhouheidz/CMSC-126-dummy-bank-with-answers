function retrieveSignedInUser(req, res, next) {
	// req.user = req.session.currentUser;
	const email = req.session.currentUser;
	console.log('retrieving signed in user');
	if(email) {
		User.findOne({where:{email:email}}).then(function(signedinuser) {
			var storeuser = {
				email: signedinuser.email,
				id: signedinuser.id,
				password: signedinuser.password
			};
			console.log('retrieved ' + storeuser.email);
			res.locals.user = storeuser;
		});
	} else {
		console.log('cannot retrieve user');
	}
	next();
}
