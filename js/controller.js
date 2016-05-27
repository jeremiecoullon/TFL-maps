app = angular.module("myApp", []);
app.controller("myController", function($scope, $http){
  $scope.firstname = 'Jeremie';
  $scope.lastname = 'Coullon';

  var map = new ol.Map({
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          target: 'map',
          controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
              collapsible: false
            })
          }),
          view: new ol.View({
            center: [0, 0],
            zoom: 2
          })
        });
        document.getElementById('zoom-out').onclick = function() {
          var view = map.getView();
          var zoom = view.getZoom();
          view.setZoom(zoom - 1);
        };

        document.getElementById('zoom-in').onclick = function() {
          var view = map.getView();
          var zoom = view.getZoom();
          view.setZoom(zoom + 1);
        };

        // Simple GET request example:
        $http({
          method: 'GET',
          url: 'https://api.tfl.gov.uk/BikePoint/117794381898481?app_id=&app_key='
        }).then(function successCallback(response) {
          console.log(response);
            // this callback will be called asynchronously
            // when the response is available
          }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
          map.on('click', function(evt) {
  var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
  var lon = lonlat[0];
  var lat = lonlat[1];
  console.log(lonlat);
});


});
