var PollHandler = require('../api/PollHandler');
var path = process.cwd();

module.exports = function(app) {
	var pollHandler = new PollHandler();

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/client/index.html');
		});

	app.route('/login')
		.get(function(req, res) {
			res.sendFile(path + '/client/login.html');
		});

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
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

	app.route('/api/choice/:id')
		.put(isLoggedIn, pollHandler.addChoice);		//auth

	app.route('/api/vote/:id')
		.put(pollHandler.vote);				//unauth
};