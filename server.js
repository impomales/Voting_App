var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('Hello...');
});

var port = process.env.PORT || 3000;

app.listen(port || 3000, function() {
	console.log('app is listening on port: ' + port);
});