app = angular.module("myApp", []);
app.controller("myController", function($scope, $http){
// workaround to pass 'this' to getBicycles function
var that = this;

// user defined radius for finding bike stations. Default is 1000
this.user = {
  radius: 1000
}

// this.register = function() {
//    console.log('User input: ', this.user.radius);
// };

  // var bike_pos = [-0.15380859374999997, 51.4796723781634]
  // var openlayer_coor = ol.proj.transform(bike_pos, 'EPSG:4326', 'EPSG:3857'); // from TFL to openlayers3
  // console.log(openlayer_coor)

  // get marker on the map
  // HACK: commented out he location of the initial point so it doesn't show on the map
  var iconFeature = new ol.Feature({
    // geometry: new ol.geom.Point([-9841.267391716443, 6713525.105043945]),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
  });

  var vectorSource = new ol.source.Vector({
    features: [iconFeature]
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  $scope.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        })
      }),
    ],
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    // center the map to London
    view: new ol.View({
      center: [-14981.657543894544, 6715107.590395161],
      zoom: 12
    })
  });

  function getBicycles(latlon){
    // console.log(latlon);

    console.log('user-selected radius: ',that.user.radius);


// original string: '&radius=1000&app_id=&app_key='

    // Simple GET request example:
    $http({
      method: 'GET',
      url: 'https://api.tfl.gov.uk/BikePoint?lat=' + latlon[1] + '&lon=' + latlon[0] + '&radius=' + that.user.radius + '&app_id=&app_key='
    }).then(function successCallback(response) {
      var features = [];
      for(var i = 0; i < response.data.places.length; i++){


        var openlayer_coor = ol.proj.transform([response.data.places[i].lon,response.data.places[i].lat], 'EPSG:4326', 'EPSG:3857'); // from TFL to openlayers3

        // console.log(openlayer_coor);

        var f = new ol.Feature({
          geometry: new ol.geom.Point(openlayer_coor),
          name: 'Null Island',
          population: 4000,
          rainfall: 500
        });

        features.push(f);

      }

      // console.log(features);

      var vc = new ol.source.Vector({
        features: features
      });

      var vl = new ol.layer.Vector({
        source: vc
      });

      vectorSource.addFeatures(features);

      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      // console.log(response.data.places);
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  $scope.map.addLayer(vectorLayer);
  $scope.map.on('click', function(evt) {

    var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'); // from openlayer3 to TFL
    var lon = lonlat[0];
    var lat = lonlat[1];

    var openlayer_coor = ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'); // from TFL to openlayers3
    // console.log(evt.coordinate);
    // console.log(lonlat);
    // console.log(openlayer_coor);

    getBicycles(lonlat);

  });

  // get marker on the map
  var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point([-17121.89433587948, 6706584.861741364]),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
  });


});
