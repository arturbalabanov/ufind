'use strict';

var mongoose = require('mongoose'),
    Tweet = mongoose.model('Tweet');

exports.all = function (req, res, next) {
  Tweet.find({}, function (err, tweets) {
    if (err) return res.json(400, err);
    res.send(tweets);
  });
};

exports.create = function (req, res, next) {
  var newTweet = new Tweet({
    body: req.body.body,
    user: req.user
  });

  newTweet.save(function (err) {
    if (err) return res.json(400, err);

    return res.json(newTweet);
  });
};

exports.show = function (req, res) {
  return Tweet.findById(req.params.id, function (err, tweet) {
    if (err) {
      return res.json(404, err);
    }

    return res.json(tweet);
  });
};
