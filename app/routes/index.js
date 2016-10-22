'use strict';

var path = process.cwd()
var PollHandler = require(path + '/app/controllers/pollHandler.server.js')
var VoterHandler = require(path + '/app/controllers/voterHandler.server.js')

module.exports = function (app, passport) {
	var pollHandler = new PollHandler()
	var voterHandler = new VoterHandler()

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	// consider different isLoggedIn for when voting.

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

	// authentication.
	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));
		
	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/login'
		}))

	// server side routes.
	// all polls.
	app.route('/api/polls')
		.get(pollHandler.getPolls)
		.post(isLoggedIn, pollHandler.addPoll)
	// poll with :id.	
	app.route('/api/polls/:id')
		.get(pollHandler.getPoll)
	// all polls created by voter :id.
	app.route('/api/myPolls')
		.get(isLoggedIn, pollHandler.getVoterPolls)
		
	// update voter info.
	app.route('/api/voterAdd')
		.put(voterHandler.addPoll)
	// shows list of voters (used for debugging)
	app.route('/api/voters')
		.get(voterHandler.getVoters)
		
	// vote
	app.route('/api/vote')
		.put(pollHandler.vote)
};
