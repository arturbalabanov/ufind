'use strict'

angular.module('ufindApp')
  .controller 'NavbarCtrl', ($scope, $location, Auth) ->
    
    $scope.menu = [
      title: 'Settings'
      link: '/settings'
    ]

    $scope.search = (query) ->
      $location.path "/search/#{$scope.searchUserQuery}"

    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/"
    
    $scope.isActive = (route) ->
      route is $location.path()
