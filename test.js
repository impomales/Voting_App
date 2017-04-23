var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var models = require('./models/models');
var routes = require('./routes/routes');
// figure a general to clean database between tests.

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
		routes(app);
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


	afterEach(function() {
		// clean out database.
		Poll.remove({}, function(err) {
			assert.ifError(err);
		})
	});

	after(function() {
		server.close();
	});

	it('successfully connects to server', function(done) {
		superagent.get(URL_ROOT + '/index.html', function(err, res) {
			assert.ifError();
			done();
		});
	});

	describe('Mongoose', function() {
		it('retrieve a user', function(done) {
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

	describe('API', function() {
		before(function() {
			var examplePolls = [
			{
				title: 'Pepsi or Coke?',
				created_by: '000000000000000000000001',
				choices: [
					{title: 'Pepsi', count: 5},
					{title: 'Coke', count: 4}
				]
			},
			{
				title: 'Favorite Food',
				created_by: '000000000000000000000001',
				choices: [
					{title: 'Pizza', count: 3},
					{title: 'Pasta', count: 5},
					{title: 'French Fries', count: 10},
					{title: 'Fried Chicken', count: 8}
				]
			}];

			Poll.create(examplePolls, function(err, result) {
				assert.ifError(err);
			});
		});

		it('can get all polls in polls database', function(done) {
			var url = URL_ROOT + '/api/polls';
			superagent.get(url, function(err, res) {
				assert.ifError(err);
				var result;

				assert.doesNotThrow(function() {
					result = JSON.parse(res.text);
				});
				
				assert.ok(result.polls);
				assert.equal(result.polls.length, 2);
				assert.ok(result.polls[0].title);
				assert.ok(result.polls[0].choices);
				assert.ok(result.polls[1].title);
				assert.ok(result.polls[1].choices);
				done();
			});
		});
	});
});