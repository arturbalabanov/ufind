'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Tweet = mongoose.model('Tweet'),
    crypto = require('crypto'),
    config = require('../config/config'),
    path = require('path'),
    fs = require('fs'),
    gm = require('gm');

var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  username: String,
  email: String,
  role: {type: String, default: 'user'},
  following: [{type: Schema.ObjectId, ref: 'User'}],
  followers: [{type: Schema.ObjectId, ref: 'User'}],
  hashedPassword: String,
  provider: String,
  salt: String,
  avatar: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Basic info to identify the current authenticated user in the app
UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      '_id': this._id,
      'username': this.username,
      'name': this.name,
      'role': this.role,
      'email': this.email,
      'provider': this.provider,
      'avatar': this.avatar
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'username': this.username,
      'name': this.name,
      'email': this.email,
      'role': this.role,
      'avatar': this.avatar
    };
  });
    
/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({username: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified username is already in use.');

// Validate username
UserSchema
  .path('username')
  .validate(function(username) {
    return (/^[A-Za-z0-9_.]{3,20}$/).test(username);
  }, 'Username must be between 3 and 20 characters long and must' +
    ' contain only letters, numerics, \'.\' and \'_\'');

UserSchema.path('email').required(true, 'Email is required.');
UserSchema.path('username').required(true, 'Username is required.');
UserSchema.path('name').required(true, 'Name is required.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  follow: function (targetUserId) {
    if (this.following.indexOf(targetUserId) === -1) {  // If is not followed already
      this.following.push(targetUserId);
      return true;
    } else {
      this.following.splice(this.following.indexOf(targetUserId), 1); // Unfollow
      return false;
    }
  },

  isFollowed: function (targetUserId) {
    if (this.following.indexOf(targetUserId) === -1) {  // If is not followed already
      return false;
    } else {
      return true;
    }
  },

  getTweetsFromFollowings: function (callback) {
    var options = {
      criteria: {user: {$in: this.following}}
    };
    return Tweet.list(options, callback);
  },

  addAvatar: function (imgPath, callback) {
    if (this.avatar) {
      fs.unlink(path.join(config.uploads_base, this.avatar));
    }
    var self = this;
    gm(imgPath)
      .resize(250, 250)
      .write(imgPath, function (err) {
        if (err) {
          console.log(err);
          return;
        } 
        self.avatar = path.basename(imgPath);
        self.save(callback);
      });
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

/**
 * Statics
 */
UserSchema.statics = {
  list: function (options, callback) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .select()
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(callback);
  } 
};

module.exports = mongoose.model('User', UserSchema);
