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

    Auth.currentUser().$promise.then (user) ->
      if user.success isnt false
        $scope.menu.push
          title: 'Profile'
          link: "/user/#{user.username}"
    
    $scope.logout = ->
      Auth.logout().then ->
        $location.path "/"
    
    $scope.isActive = (route) ->
      route is $location.path()
