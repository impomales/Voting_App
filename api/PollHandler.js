var Poll = require('../models/models').Poll;
var status = require('http-status');

module.exports = function() {
	this.getMyPolls = function(req, res) {
		// define.
		res.end();
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
		res.end();
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