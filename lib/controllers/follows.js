'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Follow User
 */
exports.follow = function(req, res, next) {
  var currentUser = req.user;

  User.findById(req.params.id, function (err, targetUser) {
    if (err) return res.json(400, err);
    if (!targetUser) return res.send(404);
    
    if (targetUser.followers.indexOf(currentUser._id) === -1) {
      targetUser.followers.push(currentUser._id);
    } else {
      targetUser.followers.splice(this.followers.indexOf(currentUser._id), 1);
    }
 
    targetUser.save(function (err) {
      if (err) return res.json(400, err);
      var follow = currentUser.follow(req.params.id);
      currentUser.save(function (err) {
        if (err) return res.json(400, err);
        return res.send(200, follow);
      });
    });
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
