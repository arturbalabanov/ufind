"use strict"

angular.module("ufindApp")
  .factory "User", ($resource) ->
    $resource "/api/users/:id",
      id: "@id"
    ,
      update:
        method: "PUT"
        params: {}

      getCurrent:
        method: "GET"
        params:
          id: "me"
