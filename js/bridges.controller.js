app = angular.module("myApp", []);
app.controller("myController", function($scope, $http){

  // [-16548.616623740658, 6718833.895524063]
  // bike position [-0.15380859374999997, 51.4796723781634]

  // var bike_pos = [-0.15380859374999997, 51.4796723781634]
  // var openlayer_coor = ol.proj.transform(bike_pos, 'EPSG:4326', 'EPSG:3857'); // from TFL to openlayers3
  // console.log(openlayer_coor)

  // get marker on the map

  var bridges = [
    {
      'coordinates': [570688.4078056616, 6813439.049969769],
      'state': 'open'
    },{
      'coordinates': [572688.4078056616, 6843439.049969769],
      'state': 'closed'
    },{
      'coordinates': [576688.4078056616, 6816439.049969769],
      'state': 'open'
    },{
      'coordinates': [550688.4078056616, 6853439.049969769],
      'state': 'open'
    },{
      'coordinates': [530688.4078056616, 6873439.049969769],
      'state': 'open'
    },{
      'coordinates': [520688.4078056616, 6883439.049969769],
      'state': 'open'
    },{
      'coordinates': [510688.4078056616, 6823439.049969769],
      'state': 'open'
    },{
      'coordinates': [540688.4078056616, 6113439.049969769],
      'state': 'open'
    },{
      'coordinates': [530688.4078056616, 7813439.049969769],
      'state': 'open'
    },{
      'coordinates': [580688.4078056616, 8813439.049969769],
      'state': 'open'
    }
  ]

  var features = [];

  for(i = 0; i < bridges.length; i++){

    var f = new ol.Feature({
      geometry: new ol.geom.Point(bridges[i].coordinates),
      state: bridges[i].state
    });

    var fill = null;

    if(bridges[i].state === 'open'){
        fill = new ol.style.Fill({ color: '#53EC6B' });
    }else{
        fill = new ol.style.Fill({ color: '#E15950' });
    }

    var style = new ol.style.Style({
      image: new ol.style.Circle({
        fill: fill,
        stroke: new ol.style.Stroke({ color: '#000' }),
        radius: 15
      }),
    });

    f.setStyle(style);
    features.push(f);

  };

  var bridgesSource = new ol.source.Vector({
    features: features
  });

  var bridgesLayer = new ol.layer.Vector({
    source: bridgesSource
  });

  var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point([-9841.267391716443, 6713525.105043945]),
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
      bridgesLayer
    ],
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
        collapsible: false
      })
    }),
    // center the map to London
    view: new ol.View({
      center: [582144.4074199023, 6837597.928222163],
      zoom: 9
    })
  });

  // Simple GET request example:
  $http({
    method: 'GET',
    url: 'https://api.tfl.gov.uk/BikePoint?lat=51.518036696751295&lon=-0.1078033447265625&radius=1000&app_id=&app_key='
  }).then(function successCallback(response) {
    var features = [];
    for(var i = 0; i < response.data.places.length; i++){

      console.log(response.data.places[i].lon);
      console.log(response.data.places[i].lat);

      var openlayer_coor = ol.proj.transform([response.data.places[i].lon,response.data.places[i].lat], 'EPSG:4326', 'EPSG:3857'); // from TFL to openlayers3

      console.log(openlayer_coor);

      var f = new ol.Feature({
        geometry: new ol.geom.Point(openlayer_coor),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      });

      features.push(f);

    }

    console.log(features);

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
    console.log(response.data.places);
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

  $scope.map.addLayer(vectorLayer);
  $scope.map.on('click', function(evt) {

    var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'); // from openlayer3 to TFL
    var lon = lonlat[0];
    var lat = lonlat[1];

    var openlayer_coor = ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857'); // from TFL to openlayers3
    console.log(evt.coordinate);
    console.log(lonlat);
    console.log(openlayer_coor);

  });

  // get marker on the map
  var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point([-17121.89433587948, 6706584.861741364]),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
  });


});
