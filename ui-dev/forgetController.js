myAPP.controller('forgetController', function ($scope, $log,$http,$location) {
  var homePath =  "http://localhost:8080/";
  $scope.username = window.username;
  $scope.hello  = "Noam";
  
  var searchObject = $location.search;

    $scope.q0 = $location.search()["q0"];
    $scope.q1 = $location.search()["q1"];
    console.log($location.search())
    
    $scope.getPassword = function() {
        console.log("verQuestions")
        if($scope.formq1!== undefined)
        {
          
        $http.post(homePath + "general/answers", 
        { username: $location.search()["user"],
         Answer1: $scope.formq0,
         Answer2: $scope.formq1
         })
        .then(function mySuccess(response) {
            if(response.data.includes("The password is"))
            {
                alert(response.data)
                $location.url("/")
            }
            else
                alert("Wrong Answers")
          });

        };
      }



});



