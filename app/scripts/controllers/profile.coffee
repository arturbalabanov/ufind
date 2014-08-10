'use strict'

# TODO: use Auth service for auth stuff...
angular.module('ufindApp')
  .controller 'ProfileCtrl', ($scope, $http)  ->
    $http.get('/api/users/me').success (user) ->
      $scope.currentUser = user

      $http.get("/api/tweets/user/#{$scope.currentUser._id}").success (tweets) ->
        $scope.tweets = tweets
