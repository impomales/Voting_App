var Poll = require('../models/models').Poll;
var status = require('http-status');

module.exports = function() {
	this.getMyPolls = function(req, res) {
		// define.
		if (!req.user) {
			return res.
					status(status.UNAUTHORIZED).
					json({ error: 'Not logged in.' });
		}

		Poll.
			find({ created_by: req.user._id }).
			exec(function(err, result) {
				if (err) {
					res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: err.toString() });
				}

				var json = {};
				json['myPolls'] = results;
				res.json(json);
			});
	};

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
	};

	this.addPoll = function(req, res) {
		// define.
		res.end();
	};

	this.getPollById = function(req, res) {
		// define.
		Poll.
			findOne({ _id: req.params.id }).
			exec(function(err, result) {
				if (err) {
					res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: err.toString() });
				}

				if (!res) {
					res.
						status(status.NOT_FOUND).
						json({ error: 'not found' });
				}

				var json = {};
				json['poll'] = result;
				res.json(json);
			});
	};

	this.deletePoll = function(req, res) {
		// define.
		res.end();
	};

	this.addChoice = function(req, res) {
		// define.
		res.end();
	};

	this.vote = function(req, res) {
		// define.
		res.end();
	};
};