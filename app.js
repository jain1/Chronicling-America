var data = [];
var pagesToSearch = 0;
var resultsPerPages = 50;



angular.module('todoApp', [])

  .controller('mainController', function($scope, $http) {
    //***************************************************************//
    //Collecting data
    //***************************************************************//

    //Helper Method
    $scope.makeCalls = function(name) {
      $http.get('http://chroniclingamerica.loc.gov/search/pages/results/?phrasetext=' + name + '&sequence=1&format=json&rows=50')
         .success(function(response) {
            pagesToSearch = Math.ceil(response.totalItems / resultsPerPages);
            console.log("Our total number of items is: " + response.totalItems);
            //console.log("Our total number of pages is: " + pagesToSearch);
            console.log("all good to go");

            console.log("We are searching through " + pagesToSearch + " pages!");
            for (var i = 1; i <= Math.min(50,pagesToSearch); i++){
              $scope.sendHTTPSCall(name, i);
            }
         }).error(function(response) {
            console.log("damaging error!");
         });
    };
    //Helper Method
    $scope.sendHTTPSCall = function(name, page) {
      $http.get('http://chroniclingamerica.loc.gov/search/pages/results/?phrasetext=' + name + '&sequence=1&format=json&page=' + page + '&rows=50')
         .success(function(response) {
            $scope.aggregate(response, false);
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
        var object = response.items[i];

        //used to check if papers had multiple locations
        // if (object.city.length > 1 || object.state.length > 1){
        //   console.log("city or state has more than one elements!");
        //   console.log(object.city + "\n" + object.state);
        // }

        //error handling
        if (object === undefined || object.city === undefined || object.state === undefined || object.date === undefined) continue;

        //we have to handle situations where that paper was published in multiple
        //locations
        for (var j = 0; j < object.city.length; j++) {
          data.push(new paper(object.city[j], object.state[j], object.date.substring(0,4)));

        }
      }
      //***************************************************************//
      //Processing data BEGIN
      //***************************************************************//

      console.log(data.length);
      //console.log(data);






      //***************************************************************//
      //Processing data END
      //***************************************************************//

    };



    $scope.makeCalls("world+war");

    function paper(city, state, year) {
      this.city = city;
      this.state = state;
      this.year = year;
    }



  });
