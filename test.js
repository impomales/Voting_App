var assert = require('assert');
var express = require('express');
var bodyparser = require('body-parser');
var superagent = require('superagent');
var models = require('./models/models');
var routes = require('./routes/routes');
var ip = require('ip');

describe('Voting App - auth', function() {
	var app; 
	var server;
	var port;
	const URL_ROOT = 'http://localhost:' + (process.env.PORT || 3000);
	var User = models.User;
	var Poll = models.Poll;
	var user_id;

	before(function() {
		app = express();
		port = process.env.PORT || 3000;

		app.use(bodyparser.json());


		app.use(function(req, res, next) {
			User.findOne({username: 'impomales'}, function(err, result) {
				assert.ifError(err);
				req.user = result;
				user_id = result._id;
				next();
			});
		});

		routes(app);
		server = app.listen(port);
	});

	after(function() {
		Poll.remove({}, function(err) {
			assert.ifError(err);
			server.close();
		});
	});

	it('successfully connects to server', function(done) {
		superagent.get(URL_ROOT + '/index.html', function(err, res) {
			assert.ifError();
			done();
		});
	});

	describe('Mongoose', function() {
		after(function() {
			Poll.remove({}, function(err) {
				assert.ifError(err);
			})
		});

		it('retrieve a user', function(done) {
			User.findOne({username: 'impomales'}, function(err, res) {
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
				created_by: user_id,	// id of impomales
				choices: [
					{title: 'Pepsi', count: 5},
					{title: 'Coke', count: 4}
				]
			},
			{
				title: 'Favorite Food',
				created_by: user_id,
				choices: [
					{title: 'Pizza', count: 3},
					{title: 'Pasta', count: 5},
					{title: 'French Fries', count: 10},
					{title: 'Fried Chicken', count: 8}
				]
			},	// this one is not created by current user.
			{
				title: 'Countries you would like to travel to',
				created_by: '000000000000000000000002',
				choices: [
					{title: 'France', count: 4},
					{title: 'Germany', count: 3},
					{title: 'Brazil', count: 3},
					{title: 'Japan', count: 4},
					{title: 'Canada', count: 5}
				]
			}];

			Poll.create(examplePolls, function(err, result) {
				assert.ifError(err);
			});
		});

		after(function() {
			Poll.remove({}, function(err) {
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
				assert.equal(result.polls.length, 3);
				assert.ok(result.polls[0].title);
				assert.ok(result.polls[0].choices);
				assert.ok(result.polls[1].title);
				assert.ok(result.polls[1].choices);
				done();
			});
		});

		it('can get all of current user\'s polls', function(done) {
			var url = URL_ROOT + '/api/mypolls';
			superagent.get(url, function(err, res) {
				assert.ifError(err);
				var result;

				assert.doesNotThrow(function() {
					result = JSON.parse(res.text);
				});

				assert.ok(result.myPolls);
				assert.equal(result.myPolls.length, 2);
				assert.ok(result.myPolls[0].title);
				assert.ok(result.myPolls[0].choices);
				assert.ok(result.myPolls[1].title);
				assert.ok(result.myPolls[1].choices);
				done();
			});
		});

		it('can add a new user poll', function(done) {
			var newPoll = {
				title: 'Drink of Choice',
				choices: 'Beer,Wine,Whiskey,Vodka,Tequila'
			};

			var url = URL_ROOT + '/api/polls';

			superagent.
				post(url).
				send(newPoll).
				end(function(err, result) {
					assert.ifError(err);

					var jsonNewPoll;

					assert.doesNotThrow(function() {
						json = JSON.parse(result.text);
					})

					assert.ok(json.newPoll);
					assert.ok(json.newPoll.title);
					assert.ok(json.newPoll.choices);
					assert.ok(json.newPoll.choices[0].title);
					assert.equal(json.newPoll.choices[0].count, 0);

					superagent.get(url, function(err, res) {
						assert.ifError(err);
						var json;

						assert.doesNotThrow(function() {
							json = JSON.parse(res.text);
						});

						assert.ok(json.polls);
						assert.equal(json.polls.length, 4);
						done();
					});
				});
		});

		it('can get a poll by id', function(done) {
			Poll.findOne({title: 'Pepsi or Coke?'}, function(err, result) {
				assert.ifError(err);
				var url = URL_ROOT + '/api/polls/' + result._id;
				superagent.get(url, function(err, res) {
					assert.ifError(err);

					var json;
					assert.doesNotThrow(function() {
						json = JSON.parse(res.text);
					});

					assert.ok(json.poll);
					assert.equal(result._id, json.poll._id)
					done();
				});
			});
		});

		it('can delete a user poll', function(done) {
			// define.
			Poll.findOne({title: 'Drink of Choice'}, function(err, deleted) {
				assert.ifError(err);

				var url = URL_ROOT + '/api/polls/' + deleted._id;

				superagent.
					del(url).
					end(function(err, result) {
						assert.ifError(err);

						url = URL_ROOT + '/api/polls';

						superagent.
							get(url, function(err, results) {
								assert.ifError(err);

								var json;
								assert.doesNotThrow(function() {
									json = JSON.parse(results.text);
								})

								assert.ok(json.polls);
								assert.equal(json.polls.length, 3);
								done();
							});
				});
			});
		});

		it('can vote as an authenticated user', function(done) {
			Poll.
				findOne({ title: 'Pepsi or Coke?' }, function(err, result) {
					assert.ifError(err);

					assert.ok(result.choices[0].count);

					var id = result._id;
					var count = result.choices[0].count;

					var url = URL_ROOT + '/api/vote/' + id;

					var vote = {
						choice: 0,
						choices: result.choices
					}

					superagent.
						put(url).
						send(vote).
						end(function(err, result) {
							assert.ifError(err);

							var json;

							assert.doesNotThrow(function() {
								json = JSON.parse(result.text);
							});

							assert.equal(json.vote.choices[0].count, count + 1);
							done();
						});
				});
		});

		it('can vote with a new user choice', function(done) {
			Poll.findOne({ title: 'Favorite Food' }, function(err, result) {
				assert.ifError(err);

				var id = result._id;

				var length = result.choices.length;

				var url = URL_ROOT + '/api/choice/' + id;

				var vote = {
					title: 'Chips and Guac',
					choices: result.choices
				}

				superagent.
					put(url).
					send(vote).
					end(function(err, result) {
						assert.ifError(err);

						var json;

						assert.doesNotThrow(function() {
							json = JSON.parse(result.text);
						});

						assert.equal(json.vote.choices.length, length + 1);
						assert.equal(json.vote.choices[length].title, 'Chips and Guac');
						assert.equal(json.vote.choices[length].count, 1);
						done();
					});
			});
		});
	});
});