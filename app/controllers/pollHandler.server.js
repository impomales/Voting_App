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
        if (!req.session.passport) res.json([])
        else {
        Polls
            .find({'createdBy': req.session.passport.user})
            .exec(function(err, result) {
                if (err) throw new Error('failed to get voter polls.')
                
                res.json(result)
            })
        }
    }
    
    // gets polls with :id.
    this.getPoll = function(req, res) {
        Polls
            .findOne({'_id': req.params.id})
            .exec(function(err, result) {
                if (err) throw new Error('failed to get poll with id' + req.params.id)
                res.json(result)
            })
    }
    
    // create a new poll.
    this.addPoll = function(req, res) {
        
        // need to process poll object before adding.
        // need req.session.passport.user to store user id.
        // need to add poll created to user model.
        var pollRaw = req.body
        var optionsRaw = pollRaw.options.split(",")
        var options = []
        optionsRaw.forEach(function(o) {
            options.push({title: o, count: 0})
        })
        var poll = new Polls({
            title: pollRaw.title,
            options: options,
            createdBy: req.session.passport.user
        })
        poll.save(function(err, result) {
            if (err) return err
            res.json(result)
        })
    }
    
    // updates count of option in poll.
    this.vote = function(req, res) {
        var poll = req.body.data
        poll.options[req.body.option].count++
        
        Polls
            .findOneAndUpdate(
                {_id: poll._id},
                {options: poll.options})
            .exec(function(err, result) {
                if (err) throw err
                res.json(result)
            })
    }
    
    // deletes poll.
    this.deletePoll = function(req, res) {
        var poll = req.body.data
        Polls 
            .remove({_id: poll._id})
    }
}

module.exports = PollHandler