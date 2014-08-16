'use strict'

angular.module('ufindApp')
  .controller 'ProfileCtrl', ($scope, $http, $routeParams)  ->

    $http.get("/api/users/username/#{$routeParams.username}").success (user) ->
      console.log user
      console.log $routeParams
      $scope.user = user

      $http.get("/api/tweets/user/#{user._id}").success (tweets) ->
        $scope.tweets = tweets
