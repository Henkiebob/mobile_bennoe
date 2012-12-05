//The mayListen variable is set to false by default. When the user hits the button to tag on the map
// The maylisten will become true, thus making the click listen and add markers
var mayListen = false;

//An array which holds the numbers
var markers = Array();

//A var to hold the map instance
var map;

//An array that holds the marker objects
var markerObjects = Array();


jQuery(document).ready(function() {
	
	var arr = [];
	//Create a submit button listener
	jQuery('#saveMarkers').click( function() {
		jQuery('#inputFields').find('.singleField').each(function () {
			//Find the ID of the parent(Its unique and auto increment)
			var markerFieldId = jQuery(this).parent().attr('id');
			
			//Split it to remove the 'markerfield-' text
			var splitId = markerFieldId.split('-');
			
			//Save the number
			var stepNumber = splitId[1];
			//Push the needed information in an array
			arr.push({
					'latlng': jQuery(this).find('#latlngField').val(),
					'title': jQuery(this).find('.titleInput').val(),
					'description': jQuery(this).find('#descriptionField').val(),
					'is_snapped': jQuery(this).find('#isSnapped').val(),
			});
		});
		data = {'triplocations_attributes': arr };

	
		
		
		//Send the request to save_markers page
		jQuery.ajax({
			url: "/trips/save_markers",
			type: "POST",
			data: {markers:  data },
			success: function(resp){
				jQuery('#creationBlock').css('display', 'none');
				jQuery('#detailsBlock').html(resp);
				jQuery('#detailsBlock').css('display', 'block');
			}
		});
		
		
		return false;
	});
});

function markerListener(marker) {
	//Create a clicklistener for the marker to open a window
	google.maps.event.addListener(marker, 'click', function(event) {
		var inputField = document.getElementById(this.id);
		var infowindow = new google.maps.InfoWindow();
		
		//Put the inputValue of the marker into the popupwindow
		infowindow.setContent(inputField.value);
		infowindow.setPosition(this.position);

		infowindow.open(map);
	});
}

function saveCurrentLocation(position) {
	var currentLat = (position == undefined) ? "52.362183" : position.coords.latitude;
	var currentLon = (position == undefined) ? "4.875183" : position.coords.longitude;
	setMap(currentLat, currentLon);
}

function failedCurrentLocation(position) {
	setMap("52.362183", "4.875183");
}

function setMap(lat, lng) {
	//Set map options
	var latlng = new google.maps.LatLng(lat, lng);
	var mapOptions = {
		center: latlng,
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	//Instantiate map
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	initialize();
}

function getLocation() {
	if (navigator.geolocation) {
		//Sends the coordinations to the function saveCurrentlocation and on fail to the failedCurrentlocation function
		navigator.geolocation.getCurrentPosition(saveCurrentLocation, failedCurrentLocation);
	} else {
		  alert("Sorry, uw browser ondersteund geen locatieherkenning.");
	}
}

function initialize() {
	jQuery("#markerToggler").click( function() {
		mayListen = (mayListen == false) ? true : false;
		if (mayListen == true) {
			jQuery(this).css('background', '#eee');
			jQuery(this).html('Stop met locaties plaatsen');
		} else {
			jQuery(this).css('background', '#ccc');
			jQuery(this).html('Start met locaties plaatsen');
		}
	});

	google.maps.event.addListener(map, 'click', function(event) {
		if (mayListen == true) {
			var latLong = event.latLng+'';
			latLong = latLong.substr(1, latLong.length-2);
			
			//Substring the ( and ) from the coordinates and push 'm into the array used to set the lines
			markers.push(event.latLng);
			//Create a marker and give it a id(used later on to identify the correct inputfield)
			var mrkr = new google.maps.Marker({
				position: event.latLng,
				map: map,
				clickable: true,
				id: 'marker-' + markers.length
			});
			
			//Push the marker object into an array(Handy for later use, such as delete)
			markerObjects.push(mrkr);
			
			//Set a boolean which states if the route is snapped to the road or not.
			var snapToRoad = (jQuery('#snapRoad').attr('checked') == "checked") ? 1 : 0;
			
			var hiddenFields = (jQuery('#notitle').attr('checked') == 'checked') ? 'display: none;' : 'display: block;';
			//Create the inputfields and append them to the form.
			var hiddenInput = '<input type="hidden" id="latlngField" value="' + latLong + '"><br>'; 
			//Create the hiddenInput which states if the route to here got snapped to the road.
			//This means that the coord before this towards this is snapped to road.
			var hiddenInputForSnap = '<input type="hidden" id="isSnapped" value="' + snapToRoad + '">';
			var titlesInput = markers.length + '<br> Titel: <input class="titleInput" onKeyPress="javascript: changeValue(\'marker-' + markers.length + '\');" id="marker-' + markers.length + '" type="text" name="titles[]">';
			
			var txtArea = 'Omschrijving: <input id="descriptionField" type="text" />';
			jQuery("#inputFields").append('\
				<div style="' + hiddenFields + '" class="singleField" id="markerFields-' + markers.length + '">\
				'+hiddenInput + hiddenInputForSnap + titlesInput + txtArea +'\
				</div>');
			
			//Create the lines between te markers
			var meters = createLines(event.latLng, snapToRoad);

			var estimatedKilometers = Math.round(meters/100) / 10;
			jQuery('#estKm').html(estimatedKilometers);
			
			//Create an eventlistener outside the DOM
			markerListener(markerObjects);
			jQuery('#saveMarkers').show();
		}
	});
}


function add_fields (link, association, content) {
	var new_id = new Date().getTime();
	var regexp = new RegExp("new_" + association, "g")
	$(link).parent().before(content.replace(regexp, new_id));
}