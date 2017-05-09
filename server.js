var express = require('express');
var routes = require('./routes/routes');
var models = require('./models/models');
var auth = require('./passport/auth');
var app = express();
var bodyparser = require('body-parser');

require('dotenv').load();

app.use(express.static('client'));
app.use(bodyparser.json());

var port = process.env.PORT || 3000;

auth(models.User, app);
routes(app);

app.listen(port || 3000, function() {
	console.log('app is listening on port: ' + port);
});