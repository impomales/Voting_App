var Poll = require('../models/models').Poll;
var status = require('http-status');

module.exports = function() {
	this.getMyPolls = function(req, res) {
		// polls created by current user.
		if (!req.user) {
			return res.
				status(status.UNAUTHORIZED).
				json({ error: 'Not logged in.' });
		}

		Poll.
			find({ created_by: req.user._id }).
			exec(function(err, results) {
				if (err) {
					return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: err.toString() });
				}

				var json = {};
				json['myPolls'] = results;
				return res.json(json);
			});
	};

	this.getPolls = function(req, res) {
		// get polls from server.
		Poll.
			find({}).
			exec(function(err, results) {
				if (err) {
					return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: err.toString() });
				}

				var json = {};
				json['polls'] = results;
				return res.json(json);
			});
	};

	this.addPoll = function(req, res) {
		// define.
		res.end();
	};

	this.getPollById = function(req, res) {
		Poll.
			findOne({ _id: req.params.id }).
			exec(function(err, result) {
				if (err) {
					return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: err.toString() });
				}

				if (!res) {
					return res.
						status(status.NOT_FOUND).
						json({ error: 'not found' });
				}

				var json = {};
				json['poll'] = result;
				return res.json(json);
			});
	};

	this.deletePoll = function(req, res) {
		// only can delete polls created by current user.
		if (!req.user) {
			return res.
				status(status.UNAUTHORIZED).
				json({ error: 'Not logged in.' });
		}

		Poll.
			find({ _id: req.params.id }).
			exec(function(err, result) {
				if (err) {
					return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: err.toString() });
				}

				if (result.created_by !== req.user._id) {
					return res.
						status(status.UNAUTHORIZED).
						json({ error: 'unauthorized to delete this poll.' })
				}

				Poll.remove({ _id: req.params.id }, function(err) {
					if (err) {
						return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({error: err.toString() });
					}
				});
			});
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