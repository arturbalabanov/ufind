'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    follows = require('./controllers/follows'),
    search = require('./controllers/search'),
    session = require('./controllers/session'),
    tweets = require('./controllers/tweets');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  
  app.get('/api/tweets', tweets.all);
  app.post('/api/tweets', middleware.auth, tweets.create);
  app.get('/api/tweets/:id', tweets.show);
  app.get('/api/tweets/user/:id', tweets.userTweets);
  
  app.post('/api/users', users.create);
  app.put('/api/users', middleware.auth, users.changePassword);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id', users.show);
  app.get('/api/users/username/:username', users.getByUsername);

  app.get('/api/users/follow/getTweets', middleware.auth, follows.getTweets);
  app.post('/api/users/follow/:id', middleware.auth, follows.follow);
  app.get('/api/users/follow/:id', middleware.auth, follows.isFollowed);

  app.get('/api/search/:query', search.searchForUser);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // All undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });
  
  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};
