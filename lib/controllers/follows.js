'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Follow User
 */
exports.follow = function(req, res, next) {
  var currentUser = req.user;
  var targetUserId = req.params.id;

  var follow = currentUser.follow(targetUserId);
  currentUser.save(function (err) {
    if (err) return res.json(400, err);
    return res.send(200, follow);
  });
};

/**
 * Checks if the targeted user is followed already
 */
exports.isFollowed = function(req, res, next) {
  var currentUser = req.user;
  var targetUserId = req.params.id;

  var isFollowed = currentUser.isFollowed(targetUserId);
  return res.send(200, isFollowed);
};

exports.getTweets = function (req, res, next) {
  var currentUser = req.user;
  currentUser.getTweetsFromFollowings(function (err, tweets) {
    if (err) return res.json(400, err);
    return res.json(200, tweets);
  });
};
