myAPP.controller('loggedController', function ($scope, $log,$http,$location) {
  $scope.username = window.username;


  $scope.poi1 = [];
  $scope.checkarray = [];
  $http.get(getPathWithToken("reg/poi/getSFavouritePOI"))
  .then(function(response) {
    //IDPOI = response.data.POI.ID;
    $scope.checkarray = response.data;
    for(var i=0;i<Math.min(2,response.data.length);i++)
      $scope.poi1.push(response.data[i]);
});

  $scope.poi3 = []
  $http.get(getPathWithToken("reg/poi/get2PoiByUserCat"))
    .then(function(response) {
      Cats = response.data.Categories;
      if (Cats != undefined)
      {
      if (Cats.length>0)
      $http.get(getPathWithToken("reg/poi/getPoiByCat/"+Cats[0]))
      .then(function(response) {
        response.data.sort(function(a, b){return parseFloat(b.rank)-parseFloat(a.rank)});
        $scope.poi3.push(response.data[0]);
      });
      if (Cats.length>1)
      $http.get(getPathWithToken("reg/poi/getPoiByCat/"+Cats[1]))
      .then(function(response) {
        response.data.sort(function(a, b){return parseFloat(b.rank)-parseFloat(a.rank)});
        $scope.poi3.push(response.data[0]);
      });
    }
});

console.log($scope.poi3)


});

myAPP.directive("bigpoi", function() {
  return {
      restrict: 'AECM',
      template: `<div class="col-md-4" >
      <div class="thumbnail" >
        <a ng-href="#!specific/{{poi.ID}}" target="_blank">
          <img ng-src="{{poi.image}}" style="width:300px; height=300px">
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
