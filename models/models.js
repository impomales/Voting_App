var mongoose = require('mongoose');
var userSchema = require('../schemas/user');
var pollSchema = require('../schemas/poll');

mongoose.connect('mongodb://localhost:27017/test');

var User = mongoose.model('User', userSchema, 'users');
var Poll = mongoose.model('Poll', pollSchema, 'polls');

var models = {
	User: User,
	Poll: Poll
};

module.exports = models;