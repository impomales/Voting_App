var PollHandler = require('../api/PollHandler');

module.exports = function(app) {
	var pollHandler = new PollHandler();

	// get polls of current user.
	app.route('/api/mypolls')
		.get(pollHandler.getMyPolls);		//auth

	// get all polls.
	app.route('/api/polls')
		.get(pollHandler.getPolls)			//unauth
		.post(pollHandler.addPoll);			//auth

	// get polls by id.
	app.route('/api/polls/:id')
		.get(pollHandler.getPollById)		//unauth
		.delete(pollHandler.deletePoll);	//auth

	app.route('/api/choice/:id')
		.put(pollHandler.addChoice);		//auth

	app.route('/api/vote/:id')
		.put(pollHandler.vote);				//unauth
};