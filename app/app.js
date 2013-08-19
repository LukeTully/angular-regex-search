/**
 * Created by Luke on 2013-08-11.
 */
var app = angular.module('RegexSearch', []);
app.config(function ($routeProvider) {

    $routeProvider.otherwise({redirectTo: "/"});

});

// Primary controller for the application
app.controller('regexListingController', function ($scope, $location, CollectRegex) {

    // All global states to be changed dynamically
    $scope.globalClasses = {
        searchStatus: []
    };
    $scope.globalStates = {
        searchStatus: false
    };

    $scope.searchData = {};
    $scope.activeInput = "search"; // Can be either search or filter

    if ($scope.globalStates.searchStatus) {
        $scope.globalClasses.searchStatus.push("search-completed");

    }

    $scope.setActiveInput = function (inputname){
        $scope.activeInput = inputname;
        $scope.searchData.filterText = "";
        console.log(inputname);
    }
    $scope.getRegexListing = function (keyword) {

        if (!$scope.globalClasses.searchStatus['search-completed']) {
            $scope.globalClasses.searchStatus.push("search-completed");
            $scope.globalStates.searchStatus = true;
        }

        $scope.searchData.regexResults = CollectRegex.getRegex(keyword);
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
app.service('CollectRegex', function ($http) {
    this.getRegex = function (keyword) {

        var regexArray = $http.get('soaprequest.php?keyword=' + keyword, {
            cache: true
        }).then(function (result) {
                if (!result.data.NewDataSet) {
                    return false;
                }
                console.log(result.data.NewDataSet.Expressions);
                return result.data.NewDataSet.Expressions;
            });

        return regexArray;
    };
});