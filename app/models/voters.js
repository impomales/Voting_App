'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Voter = new Schema({
    facebookId: String,
    displayName: String,
    pollsCreated: [{type: Schema.Types.ObjectId, ref: 'Poll'}],
    pollsVoted: [{type: Schema.Types.ObjectId, ref: 'Poll'}]
})

module.exports = mongoose.model('Voter', Voter)