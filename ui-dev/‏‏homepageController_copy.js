var myAPP = angular.module('app', ['ui.bootstrap','ngRoute']);

myAPP.controller('homepageController', function ($scope, $log,$http) {
  var homePath =  "http://localhost:8080/";
  $scope.username = "guest";
  $scope.hello = "Noam";
  var req3poi = {
    method: 'GET',
    url: homePath + "general/get3POI"
   }
  $http(req3poi)
    .then(function(response) {
      $scope.poi3 = response.data;
      $log.info($scope.poi3);
    });
});

myAPP.directive("smallpoi", function() {
  return {
      restrict: 'AECM',
      template: `<div class="col-md-3 ">
      <div class="thumbnail">
        <a href={{poi.image}} target="_blank">
          <img ng-src={{poi.image}} style="width:300px; height=300px">
          <div class="caption">
            <p text-c>{{poi.title}}
            </br>
            {{poi.city}}
            </p>
          </div>
        </a>
      </div>`,
      replace: true
  }
});

myAPP.config(function($routeProvider) {
  $routeProvider
  .when("/", {
      templateUrl : "./homepage.html",
      controller : "homepageController"
      
  })
  .when("/register", {
      templateUrl : "register.html",
      controller : "registerController"
  })
  .when("/login", {
    templateUrl : "login.html",
    controller : "loginController"
  })
  .when("/about", {
    templateUrl : "about.html",
    controller : "aboutController"
  })
  .when("/mainPoi", {
    templateUrl : "mainPoi.html",
    controller : "mainPoiController"
  })
  .when("/forget", {
    templateUrl : "forget.html",
    controller : "forgetController"
  })
  .when("/favorites", {
    templateUrl : "favorites.html",
    controller : "favoritesController"
  })
  .when("/logged", {
    templateUrl : "logged.html",
    controller : "loggedController"
  })
  .when("/specific/:id", {
    templateUrl : "specific.html",
    controller : "specificController"
  })
  
  ;
});

myAPP.controller('NavController', function ($scope, $log,$http) {
  window.username = "guest";
  window.HomePath = "#!";
  window.FavCounter = 0;
  

  $scope.$watch(
    function() {
        return window.username;
    },
    function(newValue, oldValue) {
        // Global var changed! Do stuff.
        $scope.username = newValue;
  });

  $scope.$watch(
      function() {
          return window.HomePath;
      },
      function(newValue, oldValue) {
          // Global var changed! Do stuff.
          $scope.HomePath = newValue;
      });
  
 

  $scope.$watch(
    function() {
        return window.FavCounter;
    },
    function(newValue, oldValue) {
        $scope.FavCounter = newValue;
  });

  $scope.checkUser = () => { return window.username==='guest';}
  window.checkUser = $scope.checkUser;

});



myAPP.controller('specificController', function ($scope, $log,$http,$location) {
  var homePath =  "http://localhost:8080/";
  var new111 = $location.url().replace( /^\D+/g, '');
  $scope.specificPoi = [];
  console.log(new111);
  $http.get(homePath+"general/getPOIInfo/"+new111)
  .then(function(response) { 
    $log.log(response.data[0]);
    $scope.specificPoi.push(response.data[0]);
  });
 

});

myAPP.directive("specificpoi", function() {
  return {
      restrict: 'AECM',
      template: `
      <div class="container">
      <h2>{{poi.title}}, {{poi.city}}</h2>
      <div class="card" style="width:400px">
        <img class="card-img-top" ng-src={{poi.image}} alt="Card image" style="width:100%">
          <h3 class="card-text">{{poi.description}}</p>
        </div>
      </div>
     `,
      replace: true
  }
});