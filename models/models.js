var mongoose = require('mongoose');
var userSchema = require('../schemas/user');
var pollSchema = require('../schemas/poll');

mongoose.connect('mongodb://imp88:pollsdb123@ds153501.mlab.com:53501/pollsdb');

var User = mongoose.model('User', userSchema, 'users');
var Poll = mongoose.model('Poll', pollSchema, 'polls');

var models = {
	User: User,
	Poll: Poll
};

module.exports = models;