'use strict';

var Polls = require('../models/polls.js')

function PollHandler() {
    // server side controller.
    // gets all polls.
    this.getPolls = function(req, res) {
        Polls
            .find({})
            .exec(function(err, result) {
                if (err) throw new Error('failed to get all polls.')
                
                res.json(result)
            })
    }
    // gets polls created by voted :id.
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