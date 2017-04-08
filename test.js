var assert = require('assert');
var express = require('express');
var superagent = require('superagent');

describe('Voting App', function() {
	var app; 
	var server;
	var port;
	const URL_ROOT = 'http://localhost:' + (process.env.PORT || 3000);

	before(function() {
		app = express();
		port = process.env.PORT || 3000;
		server = app.listen(port);
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
});