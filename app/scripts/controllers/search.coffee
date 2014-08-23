'use strict'

angular.module('ufindApp')
  .controller 'SearchCtrl', ($scope, $http, $routeParams) ->
    $scope.query = $routeParams.query

    $http.get("/api/search/#{$scope.query}").success (users) ->
      $scope.searchReasults = users
