myAPP.controller('aboutController', function ($scope, $log,$http) {
  var homePath =  "http://localhost:8080/";
  $scope.username = "guest";
  $scope.hello = "Noam";

  $scope.currentSlide = function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  var getBarca = {
    method: 'GET',
    url: homePath + "general/getBarcelona"
   }

  $http(getBarca)
    .then(function(response) {
      $scope.barca = response.data;
      mid = Math.ceil($scope.barca.length/2),
    
      $scope.left = $scope.barca.splice(0, Math.ceil($scope.barca.length/2)),
      $scope.right =  $scope.barca;
    });
});

myAPP.directive("barcacard", function() {
  return {
      restrict: 'AECM',
      template: `<div class="row">
      <div class="col-md-4">
        <div class="thumbnail">
          <img src="..." alt="...">
          <div class="caption">
            <h3>Thumbnail label</h3>
            <p>...</p>
            <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>
          </div>
        </div>
      </div>
    </div>`,
      replace: true
  }
});
var slideIndex = 11;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls


function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (slides!=undefined)
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  if (slides[slideIndex-1]!=undefined)
  slides[slideIndex-1].style.display = "block";
  if (dots[slideIndex-1]!=undefined)
  dots[slideIndex-1].className += " active";
} 
