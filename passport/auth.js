function setupAuth(User, app) {
	var passport = require('passport');
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.
			findOne({_id: id}).
			exec(done);
	})

	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: 'http://localhost:3000/auth/google/callback'
	}, 

	function(accessToken, refreshToken, profile, done) {
		User.findOneAndUpdate({'data.oauth': profile.id},
		{
			$set: {
				username: profile.displayName
			}
		},
			{'new': true, upsert: true, runValidators: true},
			function(err, user) {
				return done(err, user);
			});
	}));

	app.use(require('express-session')({
		secret: 'hush, hush now...',
		resave: false,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/auth/google', 
		passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));

	app.get('/auth/google/callback',
		passport.authenticate('google', {failureRedirect: '/login' }),
		function(req, res) {
			res.redirect('/');
		});
}

module.exports = setupAuth;