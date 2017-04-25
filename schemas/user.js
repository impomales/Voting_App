var mongoose = require('mongoose');

var userSchema = {
	username: {
		type: String,
		require: true
	},
	data: {
		oauth: {type: String, required: true},
		voted: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Poll'
		}]
	},
	isAuth: {
		type: Boolean,
		require: true
	}
};

module.exports = new mongoose.Schema(userSchema);