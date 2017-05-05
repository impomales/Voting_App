var Poll = require('../models/models').Poll;
var User = require('../models/models').User;
var status = require('http-status');

module.exports = function() {
	this.getMyPolls = function(req, res) {
		// polls created by current user.
		// req.user.data.oauth is invalid when not logged in.
		// depending on how I handle checking IP.
		if (req.user.data.oauth === 'invalid') {
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
		// add poll to database.
		if (req.user.data.oauth === 'invalid') {
			return res.
				status(status.UNAUTHORIZED).
				json({ error: 'Not logged in.' });
		}

		/* object sent from client side.
			{
				title: {
					type: String
				},
				choices: {
					type: String // comma, seperated
				}
			}
		*/

		var pollRaw = req.body;
		var choicesRaw = pollRaw.choices.split(',');
		var choices = [];

		choicesRaw.forEach(function(o) {
			choices.push({title: o, count: 0});
		});

		var poll = {
			title: pollRaw.title,
			choices: choices,
			created_by: req.user._id
		}

		Poll.create(poll, function(err, result) {
			if (err) {
				return res.
					status(status.INTERNAL_SERVER_ERROR).
					json({ error: err.toString() });
			}

			console.log('poll successfully saved.');
			var json = {};
			json['newPoll'] = result;
			res.json(json);
		});
	}

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
		if (req.user.data.oauth === 'invalid') {
			return res.
				status(status.UNAUTHORIZED).
				json({ error: 'Not logged in.' });
		}

		Poll.
			findOne({ _id: req.params.id }).
			exec(function(err, result) {
				if (err) {
					return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({ error: err.toString() });
				}

				

				if (String(result.created_by) !== String(req.user._id)) {
					return res.
						status(status.UNAUTHORIZED).
						json({ error: 'unauthorized to delete this poll.' })
				}

				Poll.remove({ _id: req.params.id }, function(err, removed) {
					if (err) {
						return res.
						status(status.INTERNAL_SERVER_ERROR).
						json({error: err.toString() });
					}

					console.log('poll successfully deleted.');
					var json = {};
					json['removed'] = removed;
					res.json(json);
				});
			});
	};

	this.addChoice = function(req, res) {
		// must be logged in. 
		if (req.user.data.oauth === 'invalid') {
			res.
				status(status.UNAUTHORIZED).
				json({ error: 'Not logged in.' });
		}

		/* object from client side.
			{
				title: {
					type: String
				},
				choices: [
					{title: String, count: Number}
				]
			}
		*/

		var vote = req.body;
		vote.choices.push({title: vote.title, count: 1});

		// refactor as a static function for addChoice() and vote().
		Poll.
			findByIdAndUpdate(
				req.params.id, 
				{choices: vote.choices},
				{new: true}).
			exec(function(err, result) {
				if (err) {
					res.status(status.INTERNAL_SERVER_ERROR).
					json.send({ error: err.toString() });
				}

				console.log('successfully voted');
				// need to update user. 
				var json = {};
				json['vote'] = result;
				res.json(json);
			});
	};

	this.vote = function(req, res) {
		// shouldn't be allowed to double vote. (haven't handled that yet).
		// if user not logged in, store user as an IP.

		/*	object from client side.
			{
				choice: {
					type: Number
				},
				choices: [
					{title: String, count: Number}
				]
			}
		*/
		var vote = req.body;
		vote.choices[choice].count++;

		Poll.
			findByIdAndUpdate(
				req.params.id, 
				{choices: vote.choices},
				{new: true}).
			exec(function(err, result) {
				if (err) {
					res.status(status.INTERNAL_SERVER_ERROR).
					json.send({ error: err.toString() });
				}

				console.log('successfully voted');
				// need to update user. 
				var json = {};
				json['vote'] = result;
				res.json(json);
			});
	};
};