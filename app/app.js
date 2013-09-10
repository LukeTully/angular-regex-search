/**
 * Created by Luke on 2013-08-11.
 */
var app = angular.module('RegexSearch', []);

angular.element(document).ready(function () {

    angular.bootstrap(document, ['RegexSearch']);

});

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "regex.html",
        controller: "ListingController"
    }).when('/:id', {

            templateUrl: "regex-details.html",
            controller: "ListingController"

        });

});


app.controller('ListingController', function ($scope, $routeParams, CollectRegex, Search) {

//   $scope.regexModel = {
//       keyword: Search.keyword,
//       data: Search.data
//   }

    if ($routeParams.id) {
        $scope.currentRegex = $routeParams.id;
        Search.single = CollectRegex.getRegexByID($routeParams.id);
        $scope.globalClasses.searchStatus.push("search-completed");
        $scope.globalStates.searchStatus = true;
    }
    $scope.regexModel = Search;

    // TODO: Remap returned keys to reduce the number of future changes that need to be made to the view


});
// Primary controller for the application
app.controller('SearchController', function ($scope, $location, CollectRegex, Search, $routeParams) {

    $scope.globalClasses = {
        searchStatus: []
    };
    $scope.globalStates = {
        searchStatus: false
    };

    $scope.searchData = Search;
    if ($scope.globalStates.searchStatus) {
        $scope.globalClasses.searchStatus.push("search-completed");

    }

    $scope.activeInput = "search"; // Can be either search or filter
    $scope.setActiveInput = function (inputname) {
        $scope.activeInput = inputname;
        $scope.searchData.filterText = "";
        console.log(inputname);
    }

    $scope.getRegexListing = function (keyword) {

        if (!$scope.globalClasses.searchStatus['search-completed']) {
            $scope.globalClasses.searchStatus.push("search-completed");
            $scope.globalStates.searchStatus = true;
        }

        CollectRegex.setKeyword(keyword);
        Search.data = CollectRegex.getAllRegex();

        $location.path("/");

    };


});


app.directive("expand", function () {
    return {
        scope: true,
        controller: function ($scope, $attrs) {
            $scope.globalStates.listingexpanded = false;
            $scope.globalClasses.regexState = 'teaser';
            this.toggleDetails = function (classNameToToggle) {

                $scope.$apply(function () {
                    if ($scope.globalStates.listingexpanded) {

                        $scope.globalClasses.regexState = classNameToToggle;
                        $scope.globalStates.listingexpanded = false;
                    }
                    else {
                        $scope.globalStates.listingexpanded = true;
                        $scope.globalClasses.regexState = "";

                    }

                });
            };

        }
    };
});
app.directive("triggerexpand", function () {
    return {
        require: "^expand",
        link: function (scope, element, attrs, expandCtrl) {
            element.bind("click", function () {
                expandCtrl.toggleDetails(attrs.triggerexpand);
            });
        }
    };
});


app.directive("expandfield", function () {

    return {
        scope: true,
        link: function (scope, element, attrs) {

            scope.localStates = {
                expandfield: {
                    expanded: false
                }

            };
            scope.localClasses = {
                expandfield: ""
            };

            scope.expand = function () {

                if (!scope.localStates.expandfield.expanded) {

                    scope.localStates.expandfield.expanded = true;

                    scope.localClasses.expandfield = attrs.expandfield;
                }
                else {
                    scope.localStates.expandfield.expanded = false;

                    if (scope.localClasses.expandfield == attrs.expandfield) {

                        scope.localClasses.expandfield = "";
                    }
                }
            }


        }

    };
});

app.factory('Search', function () {
    return {
        keyword: '',
        data: ''
    }
});
app.factory('CollectRegex', function ($http) {
    var regexData = {
        setKeyword: function (keyword) {
            regexData.keyword = keyword;
        },
        getAllRegex: function () {
            if (regexData.keyword) {
                var keyword = regexData.keyword;
                var regexArray = $http.get('soaprequest.php?keyword=' + keyword, {
                    cache: true
                }).then(function (result) {
                        if (!result.data) {
                            return false;
                        }
                        console.log(result.data);
                        return result.data;
                    });
                return regexArray;
            }
            else {
                console.log("Keyword not set");
            }

        },
        getRegexByID: function (id) {

            var regex = $http.get('soaprequest.php?id=' + id, {
                cache: true

            }).then(function (result) {

                    if (!result.data) {
                        console.log("No regex by that id was found");
                        return false;

                    }

                    return result.data;

                })
            return regex;

        }
    };
    return regexData;
});