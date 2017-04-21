var PollHandler = require('../api/PollHandler');

module.exports = function(app) {
	var pollHandler = new PollHandler();

	app.route('/api/polls')
		.get(pollHandler.getPolls);
};