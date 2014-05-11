'use strict'

angular.module('ufindApp')
  .factory 'Session', ($resource) ->
    $resource '/api/session/'
