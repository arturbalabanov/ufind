'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var TweetSchema = new Schema({
  body: {type: String, default: '', trim: true},
  user: {type: Schema.ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now}
});

TweetSchema.path('body').validate(function (body) {
  return body.length > 0;
}, 'The tweet body cannot be blank');

TweetSchema.statics = {
  load: function (id, callback) {
    this.findOne({_id: id})
      .populate('user', 'name')
      .exec(callback);
  },
  
  list: function (options, callback) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate('user', 'name')
      .sort({'created': -1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(callback);
  },

  userTweets: function (id, callback) {
    this.find({'user': ObjectId(id)})
      .toArray()
      .exec(callback);
  },

  countTweets: function (id, callback) {
    this.find({'user': ObjectId(id)})
      .length()
      .exec(callback);
  }
};

mongoose.model('Tweet', TweetSchema);