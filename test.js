var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var mongoose = require('mongoose');
var models = require('./models/models');

describe('Voting App', function() {
	var app; 
	var server;
	var port;
	const URL_ROOT = 'http://localhost:' + (process.env.PORT || 3000);
	var User = models.User;
	var Poll = models.Poll;

	before(function() {
		app = express();
		port = process.env.PORT || 3000;
		server = app.listen(port);

		var exampleUser = {
			username: 'impomales',
			data: {
				oauth: 'invalid',
				voted: []
			}
		};

		User.create(exampleUser, function(err, user) {
			assert.ifError(err);
		});
	});


	beforeEach(function() {
		// clean out database.
		Poll.remove({}, function(err) {
			assert.ifError(err);
		})
	});

	after(function() {
		server.close();
	});

	describe('Mongoose', function() {
		it('can store and retrieve a user', function(done) {
			User.findOne({}, function(err, res) {
				assert.ifError(err);
				assert.equal(res.username, 'impomales');
				done();
			});
		});

		it('can store and retrieve a poll', function(done) {
			var examplePoll = {
				title: 'Pepsi or Coke?',
				created_by: '000000000000000000000001',
				choices: [
					{title: 'Pepsi', count: 5},
					{title: 'Coke', count: 4}
				]
			};

			Poll.create(examplePoll, function(err, poll) {
				assert.ifError(err);
				Poll.findOne({_id: poll._id}, function(err, res) {
					assert.deepEqual(poll._id, res._id);
					done();
				});
			});
		});
	});

	it('successfully connects to server', function(done) {
		superagent.get(URL_ROOT + '/index.html', function(err, res) {
			assert.ifError();
			done();
		});
	});
});