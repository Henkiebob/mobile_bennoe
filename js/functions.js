
function createMap(triplocations, percentageX, percentageY) {
	//If a percentage isn't set the mapcanvas will be resized to 50%
	if (percentageX == "" || percentageX == undefined) {
		percentageX = 50;
	}

	if (percentageY == "" || percentageY == undefined) {
		percentageY = 50;
	}

	var locs = [];
	var latLngs = [];
	if (triplocations) {
		for (var i in triplocations) {
			locs.push({
				'tripId': triplocations[i].id, 
				'latlng': triplocations[i].latlng, 
				'is_snapped': triplocations[i].is_snapped,
				'title': triplocations[i].title,
				'description': triplocations[i].description 
			});

		}
	}
		
	clearPath();
	
	if (locs.length > 0 ) {
		//get the first location and split it(THis one is used to set the startpoint on the map)
		loc = locs[0].latlng.split(', ');
		
		//Set map options
		var mapOptions = {
			center: new google.maps.LatLng(loc[0], loc[1]),
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		


		//Instantiate map
		map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		//instantiate bounds to get the zoom accordingly to the marker range
		latlngBounds = getBounds(locs);
		map.setCenter(latlngBounds.getCenter());
		map.fitBounds(latlngBounds); 

		//Set the width and height of the mapcanvas to the given percentage.
		jQuery('#map_canvas').width(jQuery('body').width()*percentageX/100);
		jQuery('#map_canvas').height(jQuery('body').height()*percentageY/100);
		
		//Draw the markers saved in the locs array
		drawMap(locs);
		createLabels(locs);
	}
}

function getBounds(locs) {
	//Fill an array with the latitude/longitude instances
	var latLngArray = [];
	for (var i in locs) {
		loc = locs[i].latlng.split(', ');
		latLngArray.push(new google.maps.LatLng(loc[0], loc[1]));
	}

	//Loop through the latlng instances and extend the bounds
	var latlngBounds = new google.maps.LatLngBounds();
	for (var j = 0 ; j < latLngArray.length ; j++) {
	  //  And increase the bounds to take this point
	  latlngBounds.extend(latLngArray[j]);
	}

	return latlngBounds;
}

function hideAddressBar() {
	//On android and iOS devices the address bar will disappear when the pageheight is long enough
	//Doesn't work with chrome!!
	if (navigator.userAgent.match(/Android/i)) {
		window.scrollTo(0,0); // reset in case prev not scrolled  
		var nPageH = $(document).height();
		var nViewH = window.outerHeight;
		if (nViewH > nPageH) {
			nViewH -= 250;
			jQuery('BODY').css('height',nViewH + 'px');
		}
		window.scrollTo(0,1);
	}
}

function setBlockWidths() {
	var containerWidth = 0;
	//Loop through all the divs in .slideBlock class
	jQuery('.slideBlock').find('div').each( function() {
		jQuery(this).css('width', jQuery('body').width());
		jQuery(this).css('display', 'block');
		containerWidth += jQuery(this).width();
	});

	jQuery('.overflowContainer').css('width', containerWidth);
	jQuery('.slideBlock').css('width', containerWidth);
}

function slideStep(stepnr) {
	var i = 1;
	var pixelCount = 0;
	jQuery('.slideBlock').find('div').each( function() {
		if (i == stepnr) {
			//When the count equals the desired step number the slideToPixel function will be called
			//A negative pixelcount is given(To slide to the left) and the block to slide
			slideToPixel('-'+pixelCount, jQuery('.slideBlock'));
		}
		pixelCount = jQuery(this).width();
		i++;
	});
}

function slideToPixel(positionToSlideTo, objectToSlide) {
	if (objectToSlide) {
		objectToSlide.animate({
		    left : positionToSlideTo
		}, 800);
	}
}	