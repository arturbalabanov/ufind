'use strict'

angular.module('ufindApp')
  .controller 'MainCtrl', ($scope, $http, Auth) ->
    isLoggedIn = !!$scope.currentUser
    controllerForUsers = () ->
      $scope.submitNewTweet = () ->
        newTweet =
          body: $scope.newTweetBody

        $scope.newTweetBody = ""
        $http.post('/api/tweets', newTweet).success (tweet) ->
          $scope.tweets.push tweet
  
      $http.get('/api/users/follow/getTweets').success (tweets) ->
        $scope.tweets = tweets

    controllerForGuests = () ->

    if isLoggedIn
      controllerForUsers()
    else
      controllerForGuests()
