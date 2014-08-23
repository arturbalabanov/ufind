'use strict'

angular.module('ufindApp')
  .controller 'NavbarCtrl', ($scope, $location, Auth) ->
    
    $scope.menu = [
      title: 'Home'
      link: '/'
    ,
      title: 'Settings'
      link: '/settings'
    ]

    if $scope.currentUser?
      $scope.menu.push
        title: 'Profile'
        link: "/user/#{$scope.currentUser.username}"

    $scope.search = (query) ->
      $location.path "/search/#{$scope.searchUserQuery}"

    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/"
    
    $scope.isActive = (route) ->
      route is $location.path()
