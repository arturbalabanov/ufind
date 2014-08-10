'use strict'

angular.module('ufindApp')
  .controller 'NavbarCtrl', ($scope, $location, Auth) ->
    $scope.menu = [
      title: 'Home'
      link: '/'
    ,
      title: 'Settings'
      link: '/settings'
    ,
      title: 'Profile'
      link: '/profile'
    ]
    
    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/"
    
    $scope.isActive = (route) ->
      route is $location.path()
