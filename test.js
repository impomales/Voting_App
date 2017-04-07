var assert = require('assert');
var express = require('express');
var superagent = require('superagent');

describe('Voting App', function() {
	var app; 
	var server;
	var port;
	const URL_ROOT = 'localhost:' + (process.env.PORT || 3000);

	before(function() {
		app = express();
		port = process.env.PORT || 3000;
		server = app.listen(port);
	});

	after(function() {
		server.close();
	});

	it('successfully connects to server', function(done) {
		assert.ok(server);
		done();
	});
});