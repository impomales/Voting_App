var mongoose = require('mongoose');

var userSchema = {
	username: {
		type: String,
		required: true
	},
	data: {
		oauth: {type: String, required: true},
		voted: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Poll'
		}]
	}
};

module.exports = new mongoose.Schema(userSchema);