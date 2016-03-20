angular.module('todoApp', [])

  .controller('TodoListController', function($scope, $http) {
    // var todoList = this;
    // todoList.test = "hellooooo";

    $http.get('http://chroniclingamerica.loc.gov/search/titles/results/?terms=thomas&format=json&page=1')
       .success(function(response) {
          $scope.clients = response.items;
          console.log(response);
       }).error(function(response) {
          console.log(response);
       });

    // getKeyManagementResources
    //   .getKeys()
    //   .success(function(response) {
    //     $scope.clients = response.items;
    //     console.log($scope.clients.length);
    //
    //   }).error(function(response) {
    //     errorFunction(response, $scope);
    //   });
  })

  // .factory('getKeyManagementResources', ['$http', function($http) {
  //   return {
  //     getKeys: function() {
  //       return $http({
  //         method: 'GET',
  //         url: 'http://chroniclingamerica.loc.gov/search/titles/results/?terms=thomas&format=json&page=1'
  //       });
  //     },
  //   };
  // }]);
