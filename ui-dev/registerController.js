myAPP.controller('registerController', function ($scope, $log,$http,$location) {
 
  $scope.countries = [];
  $scope.selected = "";
  $scope.selected2 = [""];

  $scope.getCountries = function() {
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          myFunction(this);
      }
      };
    
    xhttp.open("GET", "../countries.xml", true);
    xhttp.send();
    function myFunction(xml) {
      var x, i,txt, xmlDoc; 
      xmlDoc = xml.responseXML;
      txt ="";
      x = xmlDoc.getElementsByTagName("Name");
      
      for (i = 0; i < x.length; i++) { 
        var person = {
          id : String(i),
          name  : String(x[i].childNodes[0].nodeValue),
      };
        $scope.countries.push(person);
      }
      $log.log($scope.countries.length);
      $log.log($scope.countries);
    };
  }
  
  $scope.getCountries();
  $scope.username = "guest";
  $scope.hello  = "yarden";
  
  $scope.submit = function() {
    var cate=$scope.selected2[0];
    for (var i=1;i<$scope.selected2.length;i++)
      cate+= "|"+$scope.selected2[i];
    
    $log.log(cate);
    if (checkUserName($scope.username1) && 
    checkPassword($scope.password) && 
    checkOnlyLetters($scope.firstName) && 
    checkOnlyLetters($scope.lastName) && 
    checkEmail($scope.email) && 
    checkSelected($scope.selected) && 
    checkSelected(cate)) 
    {
        InsertToDB($scope.username1,$scope.password,
          $scope.firstName,$scope.lastName,$scope.email,
          $scope.selected,$scope.q1,$scope.a1,$scope.q2
          ,$scope.a2,$scope.selected2,$scope.city);
          window.username = "guest";
          $location.url("/");

    }
    return ;
  };

  var InsertToDB = function(user,pass,first,last
    ,email,country,
  q1,a1,q2,a2,category,city){
    var homePath =  "http://localhost:8080/";
    
    var query = { username: user,
      password: pass,
      FirstName: first,
      LastName: last,
      City: city,
      Country: country,
      Email: email,
      VQ: q1+"|"+a1,
      VA: q2+"|"+a2,
      Categories: category  
      };
      $log.log(query);
     $http.post(homePath + "general/register",query)
  };

  

  $scope.checkHidden = function() {
    
    return true;
  ///check if all fields are correct
  };
 
  $scope.checkHidden()

});

myAPP.directive("options", function() {
  return {
      restrict: 'AECM',
      template: `<option>hello</option>`,
      replace: true
  }
});


var checkUserName = function (user) {
  if (user != undefined)
  if (user.length <3 || user.length > 8 || /[^a-z]/i.test(user))
    {
      alert("Incorrect username");
  return false;
    }
  return true;
}

var checkPassword = function (pass) {
 
  console.log(pass);
  if (pass != undefined)
  if (pass.length < 5 || pass.length > 10 || !/^(?=.*[a-z])(?=.*\d)[a-z\d]+$/i.test(pass))
    {
      alert("Incorrect password");
  return false;
    }
  return true;
}

var checkOnlyLetters = function (field) {
  if (field != undefined)
  if (/[^a-z]/i.test(field))
  {
    alert("Field must contain only letters");
  return false;
  }
  return true;
}

var checkEmail = function (email) {
  
  var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (re.test(String(email).toLowerCase()))
      return true;
    else
    {
      alert("Incorrect email");
      return false;
    }
}

var checkSelected = function (sel) {
  
  if (sel != "")
    return true;
  else
  {
    alert("Item was not choosen");
    return false;
  }
}
