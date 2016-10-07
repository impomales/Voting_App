'use strict';

var Polls = require('../models/polls.js')

function PollHandler() {
    this.getPolls = function(req, res) {
        Polls
            .find({}, {'_id': false})
            .exec(function(err, result) {
                if (err) throw new Error('failed to get all polls.')
                
                res.json(result)
            })
    }
    
    this.getVoterPolls = function(req, res) {
        Polls
            .find({'createdBy': req.params.id}, {'_id': false})
            .exec(function(err, result) {
                if (err) throw new Error('failed to get all polls.')
                
                res.json(result)
            })
    }
}

module.exports = PollHandler