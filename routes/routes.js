var PollHandler = require('../api/PollHandler');
var path = process.cwd();

module.exports = function(app) {
	var pollHandler = new PollHandler();

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	};

	// null if not logged in.
	app.route('/api/user')
		.get(function(req, res) {
			if (req.user) res.json({user: req.user});
			else res.json({user: null});
		});

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/');
		});

	// get polls of current user.
	app.route('/api/mypolls')
		.get(isLoggedIn, pollHandler.getMyPolls);		//auth

	// get all polls.
	app.route('/api/polls')
		.get(pollHandler.getPolls)			//unauth
		.post(isLoggedIn, pollHandler.addPoll);			//auth

	// get polls by id.
	app.route('/api/polls/:id')
		.get(pollHandler.getPollById)		//unauth
		.delete(isLoggedIn, pollHandler.deletePoll);	//auth

	// vote with a newly added choice.
	app.route('/api/choice/:id')
		.put(isLoggedIn, pollHandler.addChoice);		//auth

	app.route('/api/vote/:id')
		.put(pollHandler.vote);				//unauth

	// all other routes redirect to home.
	
	app.route('/*')
		.get(function(req, res) {
			res.redirect('/');
		})
};