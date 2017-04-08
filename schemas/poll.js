var mongoose = require('mongoose');

var pollSchema = {
	title: {
		type: String,
		required: true
	},
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	choices: [{
		title: {
			type: String,
			required: true
		},
		count: {
			type: Number,
			required: true
		}
	}]
};

module.exports = new mongoose.Schema(pollSchema);