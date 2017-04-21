var Poll = require('../models/models').Poll;

module.exports = function() {
	this.getPolls = function(req, res) {
		// get polls from server.
		res.send('test');
	}
}