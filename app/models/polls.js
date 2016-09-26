'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Poll = new Schema({
    createdBy: {type: Schema.Types.ObjectId, ref: 'Voter'},
    options: [{title: String, count: Number}]
})

module.exports = mongoose.model('Poll', Poll)