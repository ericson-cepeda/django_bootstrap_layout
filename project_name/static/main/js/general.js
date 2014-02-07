angular.element(document).ready(function(){

})

/* global angular */

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
                $interpolateProvider.startSymbol('{[{');
                $interpolateProvider.endSymbol('}]}');

                // Now set up the states
                Main.populatedStateProvider(Main.mainAddresses, Main.mainGeneral, "/render_page/", $stateProvider, "mainView", "")

                // For any unmatched url, send to /route1
                $urlRouterProvider.otherwise("/main/")

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
                    templateUrl: renderUrl+referenceHash[key].name+"/"
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
                    finalrUrl="/render_content/"+toState["name"]+"/"
                    $scope.filter = $resource(finalrUrl);

                    var filter = $scope.filter.get(toParams, function() {
                        $scope.aux_data = filter['aux_data']
                    });
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
                $scope.stateName = toState['name']
                render(toState, toParams)
            }
        )

        reviseUrl = $location['$$url'].replace(/\?.*/,'')
        $location.path(reviseUrl)
    }
}


Main.init()







