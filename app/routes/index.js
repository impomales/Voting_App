'use strict';

var path = process.cwd()
var PollHandler = require(path + '/app/controllers/pollHandler.server.js')

module.exports = function (app, passport) {
	var pollHandler = new PollHandler()

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	
	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));
		
	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/login'
		}))

	app.route('/api/polls')
		.get(pollHandler.getPolls)
	
	app.route('/api/:id/polls')
		.get(pollHandler.getVoterPolls)
};
