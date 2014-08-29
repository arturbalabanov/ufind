'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 *  Get profile of specified user
 */
// TODO: This "response" thing... it should be user.profile
exports.getByUsername = function (req, res, next) {
  var username = req.params.username;

  User.findOne({username: username}, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.json(200, user.profile);
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Upload an avatar
 */
exports.uploadAvatar = function(req, res, next) {
  var currentUser = req.user;
  var image = req.files.file;

  currentUser.addAvatar(image.path, function (err) {
    if (err) {
      return res.json(400, err);
    }
    return res.send(200);
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || {success: false});
};
