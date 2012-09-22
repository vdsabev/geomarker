$(function () {
  $('#mapContainer').gmap({ center: '42.696695,23.321332', zoom: 12 });
});

var timeoutIDs;
var locations;
var searchedLocations;
var errors;
var totalLocations;

function startSearch() {
  $('#startSearchButton').prop('disabled', true);
  $('#stopSearchButton').prop('disabled', false);
  $('#mapContainer').gmap('clear', 'markers');
  $('#locationsContainer').empty();
  
  var interval = parseInt($('#intervalInput').val());
  var addresses = $('#addressesInput').val().split('\n');
  timeoutIDs = [];
  locations = [];
  searchedLocations = 0;
  errors = 0;
  totalLocations = addresses.length;
  for (var index = 0; index < addresses.length; index++) {
    var location = { address: addresses[index], latitude: 'N/A', longitude: 'N/A' };
    locations.push(location);
    var timeoutID = setTimeout(searchLocation(location), index * interval);
    timeoutIDs.push(timeoutID);
  }
}

function searchLocation(location) {
  return function() {
    $('#mapContainer').gmap('search', { address: location.address }, function (results, status) {
      if (status == 'OK' ) {
        var l = results[0].geometry.location;
        location.latitude = l.lat();
        location.longitude = l.lng();
        $('#mapContainer').gmap('addMarker', {
          position: new google.maps.LatLng(location.latitude, location.longitude),
          bounds: true
        }).click(function() {
          $('#mapContainer').gmap('openInfoWindow', { content: '<b>' + location.address + '</b><br/>' + location.latitude + '<br/>' + location.longitude }, this);
        });                                                                                         ;
      }
      else { //Handle errors
        location.latitude = location.longitude = status;
        errors++;
      }
      displaySearchProgress(searchedLocations++);
      if (searchedLocations == totalLocations) {
        stopSearch();
      }
    });
  }
}

function stopSearch() {
  for (var i in timeoutIDs) {
    clearTimeout(timeoutIDs[i]);
  }

  $('#startSearchButton').prop('disabled', false);
  $('#stopSearchButton').prop('disabled', true);
  displaySearchProgress();
  
  for (var i in locations) {
    var l = locations[i];
    $('#locationsContainer').append('<tr><td>' + l.address + '</td><td>' + l.latitude + '</td><td>' + l.longitude + '</td></tr>');
  }
}

function displaySearchProgress(counter) {
  var ellipsis = '';
  if (counter != undefined) {
    for (var i = 0; i < 1 + counter % 5; i++) {
      ellipsis += '.';
    }
  }
  $('#searchProgressLabel').html(
    (errors ? '<div class="error">' + errors + ' error' + (errors == 1 ? '' : 's') + '</div>' : '') +
    '<div class="success">' + Math.round(100 * searchedLocations / totalLocations) + '% completed' + ellipsis + '</div>'
  );
}