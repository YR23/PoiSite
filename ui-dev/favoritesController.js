myAPP.controller('favoritesController', function ($scope, $log,$http,ModalService) {
  var homePath =  "http://localhost:8080/";
  $scope.Favorites = [];
  
  $scope.categories = ["travel","food","sport", "culture"];  
  $scope.rank =false;
  $scope.selected = "";
  $scope.imagecancel = "./images/cancel.jpg";
  $scope.MySortButton = true;
  $scope.MySort = [];
  $scope.MySortNums = [];


  /*Functions*/
$scope.Review = function (pid)
{
  $scope.showAModal = function() {
    $log.log ("id is "+pid);
  	// Just provide a template url, a controller and call 'showModal'.
    ModalService.showModal({
      templateUrl: "../node_modules/angular-modal-service/samples/complex/complex.html",
      controller: "ComplexController",
      inputs: {
        ID: pid,
        username: window.username
      }
    }).then(function(modal) {
      // The modal object has the element built, if this is a bootstrap modal
      // you can call 'modal' to show it, if it's a custom modal just show or hide
      // it as you need to.
      modal.element.modal();

    });
 
  };
  $scope.showAModal();
}


$scope.SaveToDB = function()
{
  for (var i = 0;i<$scope.Favorites.length; i++)
  {
  $log.log("username: "+window.username);
  $log.log("POI "+$scope.Favorites[i].ID);
  $http.post(getPathWithToken("reg/poi/save"), 
  { username: window.username, POI: $scope.Favorites[i].ID})
  .then(function mySuccess(response) {
    if(response.data.success === true)
    $log.log("entered");
  });
}
}


$scope.AddToSort = function (num,poi)
{
  if (!$scope.MySortNums.includes(num))
  {
  $scope.MySort.push({num:num,poi:poi});
  $scope.MySortNums.push(num);
  }
  else
  alert("You allready chose this number");
  if ($scope.MySortNums.length==$scope.Favorites.length)
  {
  $scope.SortByUser();
  }

}

$scope.SortByUser = function ()
{
  $scope.Favorites=[];
  for (var i = 0;i<$scope.MySort.length; i++)
  {
    $scope.Favorites.join();
    $scope.Favorites.splice($scope.MySort[i].num-1, 0,  $scope.MySort[i].poi);
    $scope.Favorites.join();
  }
  $scope.MySortButton = !$scope.MySortButton;
  $scope.MySort = [];
  $scope.MySortNums = [];
}


$scope.MySortClick = function() {
  $scope.MySortButton = !$scope.MySortButton;
}

$scope.walla = function (num){

  $scope.remove = function (array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
    window.FavCounter--;
    if(typeof(Storage) !== "undefined") {
        localStorage.setItem(window.username, JSON.stringify(array));
      }
    else 
    {
      alert("Sorry, your browser does not support web storage...");
    }
    }
  $scope.remove($scope.FavorPOI,num);
  $scope.presentPOIS();
  window.FavPOI = $scope.FavorPOI;
}

$scope.$watch('selected', function(newValue, oldValue) {
  if ($scope.selected!="")
  {
 
     
    $http.get(homePath + "general/getPoiByCat/"+$scope.selected)
      .then(function(response) {
        $scope.pois = response.data;
        
      });
    }
  });


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


  $scope.$watch('selected', function(newValue, oldValue) {
    if ($scope.selected!="")
    $scope.presentPOISCat($scope.selected); 
    });

  $scope.RankSort = function (){
  $scope.checkSelected = function (){
      return $scope.selected != "";
      }

 

   $scope.RankSort = function (){
    if ($scope.rank)
    $scope.Favorites.sort(function(a, b){return a.category.localeCompare(b.category)});
    else
    $scope.Favorites.sort(function(a, b){return parseFloat(b.rank)-parseFloat(a.rank)});
    $scope.rank = !$scope.rank;
    

    }  
    

    }  
  
  
  
  $scope.presentPOIS = function(){
    $scope.Favorites = [];
    $scope.FavorPOI = window.FavPOI;
  if ($scope.FavorPOI !=undefined && $scope.FavorPOI.length>0 )
  for (var i = 0;i<$scope.FavorPOI.length; i++)
  {
  $http.get(homePath+"general/getPOIInfo/"+$scope.FavorPOI[i])
  .then(function(response) { 
    if (!$scope.Favorites.includes(response.data[0]))
    $scope.Favorites.push(response.data[0])
        
  });
  }
}


$scope.presentPOISInit = function(){
  $scope.Favorites = [];
  $scope.FavorPOI = window.FavPOI;
if ($scope.FavorPOI !=undefined && $scope.FavorPOI.length>0 )
for (var i = 0;i<$scope.FavorPOI.length; i++)
{
$http.get(homePath+"general/getPOIInfo/"+$scope.FavorPOI[i])
.then(function(response) { 
  if (!$scope.Favorites.includes(response.data[0]))
  $scope.Favorites.push(response.data[0])
      
});
}
}



$scope.presentPOISCat = function(cat){
  $scope.Favorites = [];
  $scope.FavorPOI = window.FavPOI;
if ($scope.FavorPOI !=undefined && $scope.FavorPOI.length>0 )
for (var i = 0;i<$scope.FavorPOI.length; i++)
{
  
$http.get(homePath+"general/getPOIInfo/"+$scope.FavorPOI[i])
.then(function(response) { 
  if (response.data[0].category == cat)
  if (!$scope.Favorites.includes(response.data[0]))
  $scope.Favorites.push(response.data[0])
      
});
}
}
$scope.presentPOISInit();
  

});


myAPP.directive("favpoi", function() {
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
          <div class="col-md-1">
          <img ng-src={{imagecancel}} ng-show=MySortButton style="width:80px;height=10px; margin-top:45%" ng-click=walla(poi.ID)>
          <h4 ng-show=MySortButton style="margin-left:2px"> Delete </h4>
          <input type="number" ng-model="value" min=1 max="{{Favorites.length}}" ng-hide=MySortButton style="margin-top:45%;"> <button ng-hide=MySortButton type="button" class="btn btn-success" ng-click=AddToSort(value,poi)>OK</button>
          </div>
          <div class="col-md-1">
          <div class="row">
          <a style="margin-top: 35%;margin-left: 65px" ng-href="#!specific/{{poi.ID}}" class="btn btn-info">More Info</a>
          </div>
          <div class="row">
          <Button style="margin-top: 10px;margin-left: 56px" ng-click=Review(poi.ID) class="btn btn-success">Add Review</a>
          </div>
          </div>
          </div>
          
        </div>
        `,
      replace: true
  }
});

myAPP.controller('modalController', function ($scope, close,$log) {
 
  $log.log("im here in the modal");

});


