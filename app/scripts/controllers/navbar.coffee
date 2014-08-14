'use strict'

# TODO: use Auth service for auth stuff...
angular.module('ufindApp')
  .controller 'NavbarCtrl', ($scope, $location, $http, Auth) ->
    
    $scope.menu = [
      title: 'Home'
      link: '/'
    ,
      title: 'Settings'
      link: '/settings'
    ]

    $http.get('/api/users/me').success (user) ->
      if user isnt 'null'
        $scope.menu.push(
          title: 'Profile'
          link: "/user/#{user.username}"
        )
    
    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/"
    
    $scope.isActive = (route) ->
      route is $location.path()
