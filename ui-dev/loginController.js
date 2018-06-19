myAPP.controller('loginController', function ($scope, $log,$http,$location) {
  var homePath =  "http://localhost:8080/";
  $scope.username = "guest";
  window.hello  = "Noam";

  

    $scope.submit = function() {
      console.log("submit")
      if($scope.formUsername!== undefined)
      {
      
        
      $http.post(homePath + "general/login", { username: $scope.formUsername, password: $scope.formPassword })
      .then(function mySuccess(response) {
        if(response.data.success === true)
        {
        $log.info("Success");
        window.username = $scope.formUsername
        window.token = response.data.token;
        window.HomePath = "#!logged"
        $location.url('/logged');
        }
        else
          alert("Worng Details")


      });
      
     };
    }
    
   
    $scope.forget = function() {
      
      if($scope.formUsername!== undefined)
      {
        var req = {
          method: 'GET',
          url: homePath + `general/${$scope.formUsername}/get`
         }

         $http(req)
        .then(function(response) {
          if(response.data[0] === undefined)
            alert("Please enter valid username")
          else
            {
            $location.path('/forget').search({q0: response.data[0], q1:response.data[1],user: $scope.formUsername})
            }
          });
    };
  }

});


window.getPathWithToken = (path) =>
{
  return "http://localhost:8080/" + path + "/?token=" + window.token;
}
