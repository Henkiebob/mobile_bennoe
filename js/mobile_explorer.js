var rootDomain = 'http://www.bennoe.nl';
jQuery(function() {
	//Call initial functions
	//Hide address bar hides the address bar on mobile devices(If the content is higher than the deviceHeight)
	hideAddressBar();

	//Set the blocks to the correct widths
	setBlockWidths();

	//Listen for # behind the page. If present, call the function accordingly
	findPageByHashtag();

});

function getAllItemsInProvince(province) {
	if (province == "" || province == undefined) { 
		province = 'Friesland';
	}
	var data = {};
	var categoryArray = [];
	var statesArray = [province];
	var rangeLow  = [];
	var rangeHigh = [];
	
	data = {'categories': categoryArray,
			'province': statesArray,
			'rangeLow': rangeLow,
			'rangeHigh': rangeHigh			
	};

	$.getJSON(rootDomain + '/explore.js?callback=?&variable=toSearch', { 
		toSearch: {
					province: statesArray
				} 
		}, function(data) {
			//Huzzah!
			if (data) {
				//Empty the div in case its still filled
				jQuery('#near_routes_list').html('');
				
				//If data is returned, loop through it and create a listitem with the title of a trip.
				//An onclick will be fired if javascript is enabled, otherwise the user will be redirected to the page.
				for (var i in data) {
					if (data[i].title) {
						
						var thumbnail = '/assets/mobile_placeholder.jpg';
						if (data[i].tripphotos.length > 0 ) {
							thumbnail = data[i].tripphotos[0].filename.thumb.url;
						}

						var categoryString = '';

						if (data[i].categories.length > 0) {
							for (var j in data[i].categories) {
								categoryString += data[i].categories[j].name + ', ';
							}
						}
						categoryString = categoryString.substr(0, categoryString.length-2);
						var item = '<a class="route" href="route.html#' + data[i].id + '">\
										<span class="thumb">\
											<img src="' + rootDomain + thumbnail + '">\
										</span>\
										<span class="route_title">\
											' + data[i].title + '\
										</span>\
										<span class="route_extra">\
											s<br/>\
											' + categoryString + '\
										</span>\
									</a>';
//console.log(item);
						
						/*var listItem = '<li>\
							<a href="' + rootDomain + 'trips/' + data[i].id + '" onClick="getSingleItem(' + data[i].id + '); return false;">\
								' + data[i].title + '\
							</a>\
						</li>';
						jQuery("#list").append(listItem);*/
						console.log(data[i].title);
						jQuery('#near_routes_list').append(item);
					}
				}
			}
	    });
}

function getSingleItem(id) {
	clearPath();
	jQuery.getJSON(rootDomain + '/trips/'+ id + '.js?variable=tripsJSON&callback=?', function(data) {
		if (data) {
			
			//Slidestep function slides to the given blocknumber(Counts from left to right)
			slideStep(2);

			//Define the blocks that need to be filled
			var titleBlock = jQuery('.singleViewTitle');
			var descriptionBlock = jQuery('.singleViewDescription');

			//Empty the blocks, just to be safe.
			titleBlock.html('');
			descriptionBlock.html('');
			
			titleBlock.html(data.title);
			descriptionBlock.html(data.description);

			//Create the map according to the locations
			createMap(data.triplocations);

			//The "Walk this route" link in the singleview will have it's href changed to route.html#data.id 
			//For easier searching in route.html
			createHashTagForLink(data.id);
		}
	});
}

function createHashTagForLink(id) {
	var link = jQuery('#routeLink');
	if (link) {
		link.attr('href', 'route.html#'+id);
	}

	link.click(function() {
		window.location = jQuery(this).attr('href')
	});

}
