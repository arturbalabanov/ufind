'use strict'

angular.module('ufindApp')
  .controller 'MainAuthCtrl', ($scope, $http, Auth) ->
    $scope.messages = []

    $scope.closeMessage = (index) ->
      $scope.messages.splice(index, 1)

    $scope.submitNewTweet = () ->
      newTweet =
        body: $scope.newTweetBody

      $scope.newTweetBody = ""
      $http.post('/api/tweets', newTweet).success (tweet) ->
        message =
          body: "You successfuly added a new tweet"
          type: 'success'
        $scope.messages.push message

    $http.get('/api/users/follow/getTweets').success (tweets) ->
      $scope.tweets = tweets
