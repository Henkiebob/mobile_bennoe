var path = [];
var service;
var poly;
var distance = 0;

jQuery(document).ready(function() {
	service = new google.maps.DirectionsService();
});

function createLines(marker, snap) {
	
	//if (!service) {
		service = new google.maps.DirectionsService();
	//}

	if (snap != 0 && snap != 1) {
		snap = 0;
	}

	if (path.length == 0) {
		path.push(marker);
		poly = new google.maps.Polyline({ map: map });
		poly.setPath(path);
	} else {
		service.route({
			origin: path[path.length - 1],
			destination: marker,
			travelMode: google.maps.DirectionsTravelMode.WALKING
		}, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				if (snap == 1) {
					path = path.concat(result.routes[0].overview_path);
				} else {
					path.push(marker);
				}
				newDistance = result.routes[0].legs[0].distance.value + 0;
				
				distance = distance+newDistance;
				poly.setPath(path);
			}
		});
	}
	
	return distance;
}

function clearPath() {
	path = [];
}

function changeValue(id) {
	var inputField = document.getElementById(id);
	inputField.value = inputField.value;
}

function deleteLastWaypoint() {
	if (markerObjects) {
		//Delete and pop the last marker in the array
		markerObjects[markerObjects.length-1].setMap(null);
		markerObjects.pop();
		
		//Delete the inputFields
		jQuery('#markerFields-' + markers.length).remove();
		
		//Pop the backup array used to create the lines
		markers.pop();
	}
	
	//Create new lines on the map
	createLines(markers);
}


function getCitynameByCoordinates (coords) {
	//Send the request to google maps api to get back a JSON object with the city
	geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': coords }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			//Check to see if the cityName is present. If it is send it to a function
			//Which sets the value of the inputfield.
			if (results[0].address_components[2].short_name) {
				addCitynameToForm(results[0].address_components[2].short_name);
			}

			//Check to see if the provincename is present. If so send it to a function
			//Which handles the select form and set the correct province to selected if possible
			if (results[0].address_components[4].long_name) {
				addProvinceToSelect(results[0].address_components[4].long_name);
			}

		}
	});
}

function addCitynameToForm(name) {
	jQuery('#cityName').val(name);
}

function addProvinceToSelect(province) {
	var selectVal = '';
	jQuery('#trip_province').find('option').each (function() {
		selectVal = jQuery(this).val();
		if (selectVal == province) {
			jQuery(this).attr('selected', 'selected');
		}
	});
}

function createLabels(locs) {
	if (locs.length > 0 ) {
		for (i in locs) {
			if (locs[i].title != "") {
				var div = '<div id="label-' + locs[i].tripId + '">';
				
				div += '<h1>' + locs[i].title + '</h1>';

				if (locs[i].description != "") {
					div += '<p>' + locs[i].description + '</p>';
				}

				div += '<a href="javascript: void(0);" onClick="closeLabel();" class="close_label">X</a></div>';

				jQuery('#marker_labels').prepend(div);
			}
		}
		
	}
}

function closeLabel() {
	jQuery('#marker_labels').find('div').hide();
}