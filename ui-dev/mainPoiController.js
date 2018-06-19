myAPP.controller('mainPoiController', function ($scope, $log,$http) {
  /**vars **/
  var homePath =  "http://localhost:8080/";
  $scope.username = "guest";
  $scope.hello = "Noam";
  $scope.ischecked = false;
  $scope.categories = ["travel","food","sport", "culture"];  
  $scope.selected = "";
  
  
  $scope.imagefav = "./images/fav.jpg";
  $scope.imagenofav = "./images/nofav.jpg";
  if (window.FavPOI == undefined)
  window.FavPOI = [];
  $scope.rank =false;
  $scope.PoiName = "";

  /**Functions**/
  $scope.$watch('selected', function(newValue, oldValue) {
    if ($scope.selected!="")
    {
   
       
      $http.get(homePath + "general/getPoiByCat/"+$scope.selected)
        .then(function(response) {
          $scope.pois = response.data;
          
        });
      }
    });
  
  $scope.searchPoi = function(){
    if ($scope.PoiName!="")
    {
   
       
      $http.get(homePath + "general/getPoiByName/"+$scope.PoiName)
        .then(function(response) {
          if (response.data.length!=0)
          $scope.pois = response.data;
          else
          alert ("Sorry, No pois were found my friend");

          
        });
      }
      else
      {
        alert ("Please choose a poi name, before clicking search!");
      }

    }
  $scope.RankSort = function (){
    if ($scope.rank)
    $scope.pois.sort(function(a, b){return a.category.localeCompare(b.category)});
    else
    $scope.pois.sort(function(a, b){return parseFloat(b.rank)-parseFloat(a.rank)});
    $scope.rank = !$scope.rank;
    

    }  
  $scope.checkSelected = function (){
    return $scope.selected != "";
    }



  $scope.CheckForFav = function (fav){
    
    if (window.FavPOI.includes(fav))
      return $scope.imagefav;
    return $scope.imagenofav;
    }

  $scope.checkShow = function (){
    return window.username != "guest";
    }
  

  $scope.addToFav = function (fav){
    if (window.FavPOI.includes(fav))
    
      remove(window.FavPOI,fav);
     
    else
    {
      window.FavPOI.push(fav);
      window.FavCounter++;
      
      
    }
    if(typeof(Storage) !== "undefined") {
      
        localStorage.setItem(window.username, JSON.stringify(window.FavPOI));
      }
    else 
    {
      alert("Sorry, your browser does not support web storage...");
    }
   
    }

  function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
    window.FavCounter--;
    }

  $scope.getFavsPois = function ()
  {
    $http.get(getPathWithToken("reg/poi/getSFavouritePOI"))
    .then(function(response) {
       if (window.FavPOI == undefined)
       window.FavPOI = [];
      for(var i=0;i<response.data.length;i++)
      if (!window.FavPOI.includes(parseInt(response.data[i].POIID)))
        window.FavPOI.push(parseInt(response.data[i].POIID));
        var FavList = JSON.parse(localStorage.getItem(window.username));
        if (FavList != null || FavList != undefined)
        for(var i=0;i<FavList.length;i++)
        if (!window.FavPOI.includes(parseInt(FavList[i])))
          window.FavPOI.push(parseInt(FavList[i]));
      
      window.FavCounter = window.FavPOI.length;

  });
  }

    
  $scope.getAllPOI = function () {
  var getAll = {
  method: 'GET',
  url: homePath + "general/getAllPOI"
  }
   
  $http(getAll)
    .then(function(response) {
      $scope.pois = response.data;
      $scope.pois.sort(function(a, b){return a.category.localeCompare(b.category)});
    });
  }
  $scope.getFavsPois();
  $scope.getAllPOI();
  
});

myAPP.directive("poimain", function() {
  return {
      restrict: 'AECM',
      template: `
     
      <div class="thumbnail">
     
      <div class="row">
      
        <div class="col-md-2">
        <img ng-src="{{poi.image}}" style="width:140px;height=140px;">
        </div>
        <div class="col-md-4">
          <h2> {{poi.title}} </h2>
          <h4>{{poi.description}} </h4>
          </div>
        <div class="col-md-3">
          <h3>City: {{poi.city}}</h3>
          <h3>Category: {{poi.category}}</h3>
          <h3>Rank: {{poi.rank}}</h3>
          </div>
          <div class="col-md-1" ng-show=checkShow()>
          <img ng-src={{CheckForFav(poi.ID)}} style="width:120px;height=120px; margin-top:15%" ng-click="addToFav(poi.ID)">
          </div>
          <div class="col-md-1">
          <a style="margin-top: 65%;margin-left: 65px" ng-href="#!specific/{{poi.ID}}" class="btn btn-info">More Info</a>
          </div>
          
          </div>
          
        </div>
        `,
      replace: true
  }
});
