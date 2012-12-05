function drawMap(locations) {
	if(locations) {
		var markers = [];
		for (var i in locations) {
			loc = locations[i].latlng.split(', ');
			//Create a marker and give it a id(used later on to identify the correct inputfield)
			var markerPos = new google.maps.LatLng(loc[0], loc[1]);
			var mrkr = new google.maps.Marker({
				position: markerPos,
				map: map,
				clickable: true,
				id: locations[i].tripId
			});

			google.maps.event.addListener(mrkr, 'click', function() {
				closeLabel();
			  	jQuery('#label-' + this.id).fadeIn('fast');
			});
		
			//Create the lines between te markers
			if (locations.length > 1) {
				createLines(markerPos, locations[i].is_snapped);
			}
		}
	}
}