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
	});

	beforeEach(function() {
		// clean out database.
		User.remove({}, function(err) {
			assert.ifError(err);
			Poll.remove({}, function(err) {
				assert.ifError(err);
			})
		})
	});

	after(function() {
		server.close();
	});

	describe('Mongoose', function() {
		it('can store and retrieve a user', function(done) {
			var exampleUser = {
				username: 'impomales',
				data: {
					oauth: 'invalid',
					voted: []
				}
			}
			User.create(exampleUser, function(err, user) {
				assert.ifError(err);
				User.findOne({_id: user._id}, function(err, res) {
					assert.ifError(err);
					assert.deepEqual(user._id, res._id);
					done();
				})
			});
		});

		it('can store and retrieve a poll', function(done) {
			done(); // to be filled.
		});
	})

	it('successfully connects to server', function(done) {
		superagent.get(URL_ROOT + '/index.html', function(err, res) {
			assert.ifError();
			done();
		});
	});
});