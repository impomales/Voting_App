var express = require('express');
var app = express();

app.use(express.static('client'));

var port = process.env.PORT || 3000;

app.listen(port || 3000, function() {
	console.log('app is listening on port: ' + port);
});