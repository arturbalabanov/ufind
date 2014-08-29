'use strict';

var _ = require('lodash');
var path = require('path');

/**
 * Load environment configuration
 */
module.exports = _.merge(
    {
      uploads_base: path.join(__dirname, "..", "..", "app", "images", "avatars"),
    },
    require('./env/all.js'),
    require('./env/' + process.env.NODE_ENV + '.js') || {});
