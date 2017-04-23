var PollHandler = require('../api/PollHandler');

module.exports = function(app) {
	var pollHandler = new PollHandler();

	// get polls of current user.
	app.route('/api/mypolls')
		.get(pollHandler.getMyPolls);

	// get all polls.
	app.route('/api/polls')
		.get(pollHandler.getPolls)
		.post(pollHandler.addPoll);

	// get polls by id.
	app.route('/api/polls/:id')
		.get(pollHandler.getPollById)
		.delete(pollHandler.deletePoll);

	app.route('/api/choice/:id')
		.put(pollHandler.addChoice);

	app.route('/api/vote/:id')
		.put(pollHandler.vote);
};