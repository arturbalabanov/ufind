'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.searchForUser = function (req, res) {
  var query = req.params.query;
  var options = {
    // SELECT ... FROM User
    //     WHERE username LIKE '%query%'
    //         OR name LIKE '%query%'
    criteria: {
      $or: [
        {username: new RegExp(query, 'i')},
        {name: new RegExp(query, 'i')},
      ]
    }
  };

  return User.list(options, function (err, users) {
    if (err) {
      return res.json(400, err);
    }

    if (users.length === 0) {
      return res.send(404);
    }

    return res.json(users);
  });
};
