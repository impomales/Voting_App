'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');
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

	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.github.displayName = profile.displayName;
					newUser.github.publicRepos = profile._json.public_repos;
					newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
	
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
