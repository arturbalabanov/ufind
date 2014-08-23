'use strict'

angular.module('ufindApp')
  .controller 'ProfileCtrl', ($scope, $http, $routeParams) ->

    $http.get("/api/users/username/#{$routeParams.username}").success (user) ->
      $scope.user = user

      $http.get("/api/users/me").success (me) ->
        $scope.isMe = user._id is me._id

      $http.get("/api/tweets/user/#{user._id}").success (tweets) ->
        $scope.tweets = tweets

      $http.get("/api/users/follow/#{user._id}").success (following) ->
        $scope.following = following

      $scope.follow = ->
        $http.post("/api/users/follow/#{user._id}").success (following) ->
          $scope.following = following
