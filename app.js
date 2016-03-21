var data = [];
var newDataCount = [];
var longitude = [];
var latitude = [];
var pagesToSearch = 0;
var resultsPerPages = 50;
var maxIndex = 0;

var project;
var path;
var svg;
var width = 950;
var height = 500;


var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

angular.module('todoApp', [])

  .controller('mainController', function($scope, $http) {
    //***************************************************************//
    //Collecting data BEGIN
    //***************************************************************//

    //Helper Method
    $scope.makeCalls = function(name) {
      $http.get('http://chroniclingamerica.loc.gov/search/pages/results/?phrasetext=' + name + '&sequence=1&format=json&rows=50')
         .success(function(response) {
            data = [];
            newDataCount = [];
            longitude = [];
            latitude = [];

            pagesToSearch = 0;
            maxIndex = 0;

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
            $scope.aggregate(response);
         }).error(function(response) {
            console.log("Error at sendHTTPSCall()");
         });
    };
    //Helper Method
    $scope.aggregate = function(response){
      for (var i = 0; i < resultsPerPages; i++) {
        var object = response.items[i];
        //console.log(object);

        //error handling
        if (object === undefined || object.city === undefined || object.state === undefined || object.date === undefined) continue;

        //we have to handle situations where that paper was published in multiple
        //locations
        for (var j = 0; j < object.city.length; j++) {
          var city = object.city[j];
          var state = object.state[j];

          for(var k = 0; k < states.length; k++){
              if(states[k][0] == state){
                  state = states[k][1];
              }
          }

          var newObject = new paper(city, state, object.date.substring(0,4));
          data.push(newObject);
        }
        //console.log(data.length);
        //printing out individual elements
        // for (var z = 0; z < data.length; z++){
        //   console.log(data[z]);
        // }
      }
    };

    $scope.getGeographicalAddress = function(newData) {
      $http.get('test.json')
         .success(function(response) {
            for (var i = 0; i < newData.length; i++){
              console.log("we are looking at: " + newData[i]);
              var tokens = newData[i].split(","); //split city and state

              var found = false;
              for (var j = 0; j < response.length; j++){
                if(response[j].FIELD1 == tokens[1] && response[j].FIELD2 == tokens[0]){
                  console.log("we found a match!");
                  var lat = response[j].FIELD3;
                  var lng = response[j].FIELD4;

                  console.log("our city is at: " + lat + ", " + lng);

                  longitude.push(lat);
                  latitude.push(lng);

                  found = true;
                  break;
                }
              }
              if (!found){
                console.log("NOT FOUND!!: " + tokens);
                longitude.push(-500);
                latitude.push(-500);
              }
            }
         }).error(function(response) {
            console.log("Error at loading json");
         });
    };



    //***************************************************************//
    //Collecting data END
    //***************************************************************//

    function paper(city, state, year) {
      this.city = city;
      this.state = state;
      this.year = year;
    }
    $scope.init = function() {

    };

    $scope.inputData = function(user){

      user = user.replace(" ", "+");
      $scope.makeCalls(user);
      setTimeout(function () {
        maxIndex = data.length;
        console.log("The max Index is: " + maxIndex);

        //TODO
        //sort the array by the year

        // $scope.elements = data;
        // $scope.newElements = newData;
        var newData = [];

        for (var i = 0; i < maxIndex; i++){
          var address = data[i].city + "," + data[i].state;
          if (newData.length === 0 || newData.indexOf(address) < 0){
            newData.push(address);
            newDataCount.push(1);
          }
          else {
            newDataCount[newData.indexOf(address)]++;
          }
        }
        console.log(newDataCount.length);

        $scope.getGeographicalAddress(newData);
        // for (var k = 0; k < newData.length; k++){
        //   //console.log(newData[k]);
        //   $scope.getGeographicalAddress(newData[k]);
        // }


      }, 5000);
      setTimeout(function(){
        loadD3();
        //addData();
      }, 7000);
      function loadD3() {
          // console.log(latitude.length);
          // console.log(longitude.length);
          // console.log("MUHAHAHAHAHAH");
          // for (var i = 0; i < 50; i++) {
          //   console.log(data[i].longitude);
          //   console.log(data[i].latitude);
          // }
          //***************************************************************//
          //D3 BEGIN
          //***************************************************************//

          d3.selectAll("svg > *").remove();

          projection = d3.geo.albersUsa()
              .scale(1000)
              .translate([width / 2, height / 2]);

          path = d3.geo.path()
              .projection(projection);

          svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);
          d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/us.json", function(error, us) {
            if (error) throw error;

            svg.insert("path", ".graticule")
                .datum(topojson.feature(us, us.objects.land))
                .attr("class", "land")
                .attr("d", path);

            svg.insert("path", ".graticule")
                .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
                .attr("class", "county-boundary")
                .attr("d", path);

            svg.insert("path", ".graticule")
                .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
                .attr("class", "state-boundary")
                .attr("d", path);

            //TODO
            //find the max value of newDataCount
            addData();


          });
          //d3.select(self.frameElement).style("height", height);
          //addData();

          //***************************************************************//
          //D3 END
          //***************************************************************//
      }

      // setTimeout(function() {
      //   addData(1850);
      //   //addData(1850);
      //   console.log("completed 20 second delay");
      //   console.log(20 < undefined);
      // }, 20000);
    };

    function addData(year){
      //removes all previous elements
      svg.selectAll("circle").remove();
      if (year !== undefined){
        for (var i = 0; i < newDataCount.length; i++){
          if (latitude[i] != -500 && data[i].year < year){
            var l = Number(latitude[i]);
            var ll = Number(longitude[i]);

            //console.log(l + ", " + ll);
            //TODO
            //find max of data before you are making the circles
            var loc = projection([l, ll]);
            svg.append("circle")
                .attr("cx", loc[0])
                .attr("cy", loc[1])
                .attr("r", newDataCount[i])
                .style("fill", "red");
          }
        }
      }
      else {
        for (var j = 0; j < newDataCount.length; j++){
          if (latitude[j] != -500){
            var l1 = Number(latitude[j]);
            var ll1 = Number(longitude[j]);

            //console.log(l + ", " + ll);

            var loc1 = projection([l1, ll1]);
            svg.append("circle")
                .attr("cx", loc1[0])
                .attr("cy", loc1[1])
                .attr("r", newDataCount[j])
                .style("fill", "red");
          }
        }
      }
    }

  });
