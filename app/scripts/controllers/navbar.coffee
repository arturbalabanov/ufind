'use strict'

angular.module('ufindApp')
  .controller 'NavbarCtrl', ($scope, $location, Auth, $http) ->

    $scope.menu = [
      title: 'Settings'
      link: '/settings'
    ]

    $scope.search = (query) ->
      $location.path "/search/#{$scope.searchUserQuery}"

    $scope.getUsers = (query) ->
      $http.get("/api/search/#{query}").then (results) ->
        users = []
        angular.forEach results.data, (item) ->
          users.push item.username

        return users

    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/"

    $scope.isActive = (route) ->
      route is $location.path()
