var express = require('express');
var routes = require('./routes/routes');
var app = express();
var bodyparser = require('body-parser');

app.use(express.static('client'));
app.use(bodyparser.json());

var port = process.env.PORT || 3000;

routes(app);

app.listen(port || 3000, function() {
	console.log('app is listening on port: ' + port);
});