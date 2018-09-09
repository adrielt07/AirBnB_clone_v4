// This script will listen if box check to account for amenity id or remove

let list = {}
let keys = []
$( document ).ready(function() {
  $('input:checkbox').on('click', function() {
    if ($(this).is(':checked')) {
      list[$(this).attr('data-name')] = $(this).attr('data-id')
    } else {
      delete list[$(this).attr('data-name')]
    }
    keys = Object.keys(list);
    $('DIV.amenities h4').text( keys.join(', '));
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data, stats) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});
