var Poll = require('../models/models').Poll;
var status = require('http-status');

module.exports = function() {
	this.getPolls = function(req, res) {
		// get polls from server.
		Poll.
			find({}).
			exec(function(err, results) {
				if (err) {
					res.
					status(status.INTERNAL_SERVER_ERROR).
					json({ error: err.toString() });
				}

				var json = {};
				json['polls'] = results;
				res.json(json);
			});
	}
}