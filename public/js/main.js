$(document).ready(function(){
    var location1 = document.getElementById('location1');
    var locationChanged = new google.maps.places.Autocomplete(location1);

    var location2 = document.getElementById('location2');
    var locationFinal = new google.maps.places.Autocomplete(location2);

    google.maps.event.addListener(locationChanged, 'place_changed', function(data) {
        $('.locationInput').hide();

        location2.value = location1.value;
        $('.expanded-location').removeClass('hide');
        return false;
    });


    $('.showTopMenu').click(function(){
        $('.fixed-drop-down-menu').toggle();
    });

})