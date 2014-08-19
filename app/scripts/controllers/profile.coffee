'use strict'

angular.module('ufindApp')
  .controller 'ProfileCtrl', ($scope, $http, $routeParams) ->

    $http.get("/api/users/username/#{$routeParams.username}").success (user) ->
      $scope.user = user

      $http.get("/api/tweets/user/#{user._id}").success (tweets) ->
        $scope.tweets = tweets

      $scope.following = false

      # TODO: To get this actually work
      $scope.unfollow = ->
        $scope.following = false

      $scope.follow = ->
        $http.post("/api/users/follow/#{user._id}").success ->
          $scope.following = true
