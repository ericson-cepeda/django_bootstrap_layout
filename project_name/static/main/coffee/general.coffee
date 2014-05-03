# global angular
$_ = (selector) ->
  angular.element selector

$_ ->

Main =
  mainGeneral: "/"
  mainAddresses:
    main:
      name: "main"
    test:
      name: 'test',
      additional_variables: [
          'test'
      ]

  module: angular.module("Main", [
    "ngRoute"
    "ui.router"
    "ngResource"
    "google-maps"
    "angularSmoothscroll"
  ], ($routeProvider, $locationProvider) ->
    $locationProvider.html5Mode true
    return
  )
  init: ->

    # Show loader

    # Hide loader

    # Hide loader

    # Now set up the states

    # For any unmatched url, send to /route1
    Main.module.factory("httpInterceptor", ($q, $rootScope, $log) ->
      numLoadings = 0
      request: (config) ->
        numLoadings++
        $rootScope.$broadcast "loader_show"
        config or $q.when(config)

      response: (response) ->
        $rootScope.$broadcast "loader_hide"  if (--numLoadings) is 0
        response or $q.when(response)

      responseError: (response) ->
        $rootScope.$broadcast "loader_hide"  unless --numLoadings
        $q.reject response
    ).config(($interpolateProvider, $stateProvider, $urlRouterProvider, $httpProvider) ->
      $interpolateProvider.startSymbol "{$"
      $interpolateProvider.endSymbol "$}"
      Main.populatedStateProvider Main.mainAddresses, Main.mainGeneral, "/render_page/", $stateProvider, "mainView", ""
      $urlRouterProvider.otherwise "/main/"
      $_("<div loader style=\"position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background-color:gray;background-color:rgba(70,70,70,0.2);\"><i style=\"position:absolute;top:50%;left:50%;font-size:50px;color:gray;\" class=\"fa fa-spinner fa-spin\" /></div>").appendTo($_("body")).hide()
      $httpProvider.interceptors.push "httpInterceptor"
      return
    ).filter("split", ->
      (input, splitChar) ->
        input.split splitChar
    ).directive("loader", ($rootScope) ->
      ($scope, element, attrs) ->
        $scope.$on "loader_show", ->
          $_("#main_view").addClass "loading"  unless $rootScope.stateName is $rootScope.stateNamePrev
          element.show()

        $scope.$on "loader_hide", ->
          $_("#main_view").removeClass "loading"  unless $rootScope.stateName is $rootScope.stateNamePrev
          element.hide()

    ).controller "MainCtrl", Main.MainCtrl
    return

  populatedStateProvider: (referenceHash, baseUrl, renderUrl, $stateProvider, referenceView, parentState) ->
    for key of referenceHash
      if referenceHash.hasOwnProperty(key)
        completeUrl = baseUrl + referenceHash[key].name
        completeUrl += referenceHash[key]["additional_variables"]  if referenceHash[key].hasOwnProperty("additional_variables")
        completeUrl += "/"
        stateHash =
          url: completeUrl # root route
          views: {}
          parent: parentState
          content_class: referenceHash[key].content_class
          container_class: referenceHash[key].container_class

        stateHash.views[referenceView + "@" + parentState] =
          templateUrl: renderUrl + referenceHash[key].name + "/"
          resolve:
            aux_data: ($stateParams, $http, $rootScope) ->
              finalrUrl = "/render_data/" + $rootScope.stateName
              $http(
                method: "GET"
                url: finalrUrl
                params: $stateParams
              ).then (data) ->
                $rootScope.aux_data = data.data["aux_data"]
                data.data["aux_data"]


        stateName = (if parentState isnt "" then parentState + "_" + referenceHash[key].name else referenceHash[key].name)
        $stateProvider.state stateName, stateHash
    $stateProvider

  MainCtrl: ($rootScope, $scope, $log, $location) ->
    render = (toState, toParams) ->
      switch $scope.stateName
        when "main"
          $scope.aux_data = $rootScope.aux_data

    $scope.initialize is (data) ->
      $log.log "initialize", data
      $scope.initialize = data
      return

    $scope.$on "$stateChangeSuccess", (event, toState, toParams) ->
      renderAction = $location["$$path"].replace("/?.*/", "")
      $scope.currentPath = renderAction
      render toState, toParams
      return

    $scope.$on "$stateChangeStart", (event, toState, toParams, fromState, fromParams) ->
      $rootScope.stateName = toState["name"]
      $rootScope.stateNamePrev = fromState["name"]
      return

    reviseUrl = $location["$$url"].replace(/\?.*/, "")
    $location.path reviseUrl
    return

Main.init()