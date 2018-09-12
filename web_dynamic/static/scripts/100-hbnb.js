// This script will listen if box check to account for amenity id or removez
let amenity_list = {}
let city_list = {}
let state_list = {}
let keys = []
$( document ).ready(function() {
// Retrives amenity objects
  $('.amenities input:checkbox').on('click', function() {
    let amen_keys = [];
    if ($(this).is(':checked')) {
      amenity_list[$(this).attr('data-name')] = $(this).attr('data-id')
    } else {
      delete amenity_list[$(this).attr('data-name')]
    }
    amen_keys = Object.keys(amenity_list);
    $('DIV.amenities h4').empty();
    $('DIV.amenities h4').append( '&nbsp;' + amen_keys.join(', '));
  });

// Retrieves checked states object - STATE
  $('input:checkbox.states').on('click', function() {
    if ($(this).is(':checked')) {
      state_list[$(this).attr('data-name')] = $(this).attr('data-id')
    } else {
      delete state_list[$(this).attr('data-name')]
    }
    $('DIV.locations h4').empty();
    keys = Object.keys(state_list);
    $('DIV.locations h4').append( '&nbsp;' + keys.join(', '));
  });


// Retrieves checked cities object -  CITY
  $('input:checkbox.cities').on('click', function() {
    let keys = [];
    if ($(this).is(':checked')) {
      city_list[$(this).attr('data-name')] = $(this).attr('data-id')
    } else {
      delete city_list[$(this).attr('data-name')]
    }
  });
  keys = Object.keys(state_list).concat(Object.keys(city_list));
  $('DIV.locations h4').empty();
  $('DIV.locations h4').append( '&nbsp;' + keys.join(', '));


// Added status check if api is running
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data, stats) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

// Send a Post request to search for all Places
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    success: function(data) { myfunc(data) },
    contentType: "application/json",
    dataType: 'json'
  });

// Sends a Post Request when Search button is clicked
  $('BUTTON').on('click', function () {
    if ($(this).data('clicked', true)) {
      $.ajax({
	type: 'POST',
	url: 'http://0.0.0.0:5001/api/v1/places_search',
	data: JSON.stringify({"cities": Object.values(city_list), "states": Object.values(state_list), "amenities": Object.values(amenity_list)}),
	success: function(data) { myfunc(data) },
	contentType: "application/json",
	dataType: "json"
      });
    };
  });

  function myfunc(places) {
    $(places).each(function (index, place) {
      $.getJSON('http://0.0.0.0:5001/api/v1/users/' + place.user_id, function (data, stats) {
	$('SECTION.places').append('<article><div class="title"><h2>' + place.name + '</h2><div class="price_by_night">' + '$' + place.price_by_night + '</div></div><div class="information"><div class="max_guest"><i class="fa fa-users fa-3x" aria-hidden="true"></i><br />' + place.max_guest + ' Guests' + '</div><div class="number_rooms"><i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />' + place.number_rooms + ' Bedrooms</div><div class="number_bathrooms"><i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />' + place.number_bathrooms + ' Bathroom</div></div><div class="user"><strong>Owner: </strong>' + data.first_name + ' ' + data.last_name + '</div><div class="description">' + place.description + '</div></article>');
      });
    });
    updatePlaces(places);
  }

  function updatePlaces(data) {
    $( "SECTION.places" ).html(data);
  }
});
