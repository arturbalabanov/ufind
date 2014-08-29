'use strict'

angular.module('ufindApp')
  .controller 'SettingsCtrl', ($scope, $upload, User, Auth) ->
    $scope.errors = {}

    $scope.changePassword = (form) ->
      $scope.submitted = true
      
      if form.$valid
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
        .then(->
          $scope.message = 'Password successfully changed.'
        ).catch( ->
          form.password.$setValidity 'mongoose', false
          $scope.errors.other = 'Incorrect password'
        )
    
    $scope.uploadAvatar = (image) ->
      if angular.isArray image
        image = image[0]

      if image.type isnt 'image/png' and image.type isnt 'image/jpeg'
        alert('Only PNG and JPEG are supported')
        return

      $scope.uploadInProgress = true
      $scope.uploadProgress = 0

      $scope.upload = $upload.upload({
        url: '/api/users/avatar',
        method: 'POST',
        file: image
      }).progress( (event) ->
        $scope.uploadProgress = Math.floor(event.loaded / event.total)
        # $scope.$apply()
      ).success( (data, status, headers, config) ->
        $scope.uploadInProgress = false
      ).error( (err) ->
        $scope.uploadInProgress = false
        alert "error"
        console.log "error: #{err.message || err}"
      )
