var data = [];
var pagesToSearch = 0;
var resultsPerPages = 20;



angular.module('todoApp', [])

  .controller('mainController', function($scope, $http) {
    //***************************************************************//
    //Collecting data
    //***************************************************************//

    //Helper Method
    $scope.makeCalls = function(name) {
      $http.get('http://chroniclingamerica.loc.gov/search/titles/results/?andtext=' + name + '&format=json')
         .success(function(response) {
            pagesToSearch = Math.ceil(response.totalItems / resultsPerPages);
            console.log("Our total number of pages is: " + pagesToSearch);
            console.log("all good to go");

            console.log("We are searching through " + pagesToSearch + " pages!");
            for (var i = 1; i <= Math.min(10,pagesToSearch); i++){
              $scope.sendHTTPSCall(name, i);
            }
         }).error(function(response) {
            console.log("damaging error!");
         });
    };
    //Helper Method
    $scope.sendHTTPSCall = function(name, page) {
      $http.get('http://chroniclingamerica.loc.gov/search/titles/results/?andtext=' + name + '&format=json&page=' + page)
         .success(function(response) {
            $scope.aggregate(response, false);
            pagesToSearch--;
         }).error(function(response) {
            console.log("Error at sendHTTPSCall()");
         });
    };
    //Helper Method
    $scope.aggregate = function(response, restart){
      if (restart === true){
        console.log("restarting");
        data = [];
        pagesToSearch = 0;
      }
      for (var i = 0; i < resultsPerPages; i++) {
        data.push(response.items[i]);
      }
      //***************************************************************//
      //Processing data BEGIN
      //***************************************************************//

      console.log(data);





      //***************************************************************//
      //Processing data END
      //***************************************************************//

    };



    $scope.makeCalls("america");




  });
