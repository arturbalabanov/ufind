'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tweet = mongoose.model('Tweet');

exports.show = function (req, res) {
  return Tweet.load(req.params.id, function (err, tweet) {
    if (err) {
      return res.json(404, err);
    }

    return res.json(tweet);
  });
};

exports.all = function (req, res, next) {
  var options = {};
  return Tweet.list(options, function (err, tweets) {
    if (err) {
      return res.json(400, err);
    }

    return res.json(tweets);
  });
};

exports.create = function (req, res, next) {
  var newTweet = new Tweet({
    body: req.body.body,
    user: req.user
  });

  newTweet.save(function (err) {
    if (err) {
      return res.json(400, err);
    }

    Tweet.populate(newTweet, {path: "user", select: "name username"}, function (err, tweet) {
      if (err) {
        return res.json(400, err);
      }

      return res.json(tweet);
    });
  });
};

exports.show = function (req, res) {
  return Tweet.load(req.params.id, function (err, tweet) {
    if (err) {
      return res.json(404, err);
    }

    return res.json(tweet);
  });
};

exports.userTweets = function (req, res) {
  return User.findById(req.params.id, function (err, user) {
    if (err) {
      return res.json(404, err);
    }

    return Tweet.userTweets(user._id, function (err, tweets) {
      if (err) {
        return res.json(400, err);
      }

      return res.json(tweets);
    });
  });
};
