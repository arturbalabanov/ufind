'use strict'

angular.module('ufindApp')
  .controller 'MainCtrl', ($scope, $http, Auth) ->
    $scope.submitNewTweet = () ->
      newTweet =
        body: $scope.newTweetBody

      $scope.newTweetBody = ""
      $http.post('/api/tweets', newTweet).success (tweet) ->
        $scope.tweets.push tweet
 
    $http.get('/api/users/follow/getTweets').success (tweets) ->
      $scope.tweets = tweets
