'use strict'

var Voters = require('../models/voters.js')

function VoterHandler() {
    this.getVoters = function(req, res) {
        Voters
            .find({})
            .exec(function(err, result) {
                if (err) return err
                res.json(result)
            })
    }
    
    this.addPoll = function(req, res) {
        Voters
            .findOneAndUpdate(
                {_id: req.session.passport.user},
                {$push: {pollsCreated: req.body._id}})
            .exec(function(err, result) {
                if (err) return err
                res.json(result)
            })
    }
}

module.exports = VoterHandler