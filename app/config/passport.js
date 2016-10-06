'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var Voter = require('../models/voters');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		Voter.findById(id, function(err, voter) {
			done(err, voter)
		})
	});
	
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL
	}, 
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			Voter.findOne({'facebookId': profile.id}, function(err, user) {
				if (err) return done(err)
				
				if (user) return done(null, user)
				else {
					var newVoter = new Voter()
					
					newVoter.facebookId = profile.id
					newVoter.displayName = profile.displayName
					
					newVoter.save(function(err) {
						if (err) throw err
						return done(null, newVoter)
					})
				}
			})
		})
	}))
};
