/* global angular */
var $_ = function(selector){
    return angular.element(selector)
}

$_(function(){
})

var Main = {
    mainGeneral : "/",
    mainAddresses : {
        "main":							{"name":"main"}
    },
    module: angular.module('Main', ['ngRoute', 'ui.router', 'ngResource', "google-maps", 'angularSmoothscroll'], function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
    }),
    init: function(){
        Main.module
            .config(function($interpolateProvider, $stateProvider, $urlRouterProvider) {
                $interpolateProvider.startSymbol('{$');
                $interpolateProvider.endSymbol('$}');

                // Now set up the states
                Main.populatedStateProvider(Main.mainAddresses, Main.mainGeneral, "/render_page/", $stateProvider, "mainView", "")

                // For any unmatched url, send to /route1
                $urlRouterProvider.otherwise("/main/")

                var numLoadings = 0;
                var loadingScreen = $('<div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background-color:gray;background-color:rgba(70,70,70,0.2);"><i style="position:absolute;top:50%;left:50%;font-size:50px;color:gray;" class="icon-spinner icon-spin icon-large" /></div>')
                    .appendTo($('body')).hide();
                $httpProvider.responseInterceptors.push(function($rootScope) {
                    return function(promise) {
                        numLoadings++;
                        loadingScreen.show();
                        if ($rootScope.stateName != $rootScope.stateNamePrev)
                            $_('#content_view').addClass('loading')
                        console.log($rootScope)
                        var hide = function(r) {
                            if (!(--numLoadings)){
                                loadingScreen.hide();
                                if ($rootScope.stateName != $rootScope.stateNamePrev)
                                   $_('#content_view').removeClass('loading')
                            }
                            return r;
                        };
                        return promise.then(hide, hide);
                    };
                });

            })
            .filter('split', function() {
                return function(input, splitChar) {
                    return input.split(splitChar);
                }
            })
            .controller('MainCtrl', Main.MainCtrl)
    },
    populatedStateProvider: function(referenceHash, baseUrl, renderUrl, $stateProvider, referenceView, parentState){
        for (var key in referenceHash) {
            if (referenceHash.hasOwnProperty(key)) {
                completeUrl = baseUrl+referenceHash[key].name
                if (referenceHash[key].hasOwnProperty("additional_variables"))
                    completeUrl += referenceHash[key]["additional_variables"]
                completeUrl += "/"
                var stateHash = {
                    url: completeUrl, // root route
                    views: {},
                    parent: parentState,
                    content_class: referenceHash[key].content_class,
                    container_class: referenceHash[key].container_class
                }

                stateHash.views[referenceView+"@"+parentState] = {
                    templateUrl: renderUrl+referenceHash[key].name+"/",
                    resolve: {
                        aux_data: function($stateParams, $http, $rootScope) {
                            finalrUrl="/render_data/"+$rootScope.stateName
                            return $http({method: 'GET', url: finalrUrl, params: $stateParams})
                                .then (function (data) {
                                $rootScope.aux_data = data.data['aux_data']
                                return data.data['aux_data'];
                            });
                        }
                    }
                }

                stateName = parentState != ""? parentState+"_"+referenceHash[key].name: referenceHash[key].name
                $stateProvider
                    .state(stateName, stateHash)
            }
        }
        return $stateProvider
    },
    MainCtrl: function ($scope, $log, $location, $resource) {

        var render = function(toState, toParams){

            switch ($scope.stateName){
                case "main":
                        $scope.aux_data = $rootScope.aux_data
                    break;
            }
        }

        $scope.initialize == function(data){
            $log.log('initialize', data)
            $scope.initialize = data
        }
        $scope.$on(
            "$stateChangeSuccess",
            function(event, toState, toParams){
                var renderAction = $location['$$path'].replace('/\?.*/','')
                $scope.currentPath = renderAction
                render(toState, toParams)
            }
        )

        $scope.$on(
            "$stateChangeStart",
            function(event, toState, toParams, fromState, fromParams){
                $rootScope.stateName = toState['name']
                $rootScope.stateNamePrev = fromState['name']
            }
        )

        reviseUrl = $location['$$url'].replace(/\?.*/,'')
        $location.path(reviseUrl)
    }
}


Main.init()







