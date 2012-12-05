var rootDomain = 'http://localhost:3000/';
jQuery(function() {
	//Call initial functions
	//Hide address bar hides the address bar on mobile devices(If the content is higher than the deviceHeight)
	hideAddressBar();

	//Set the blocks to the correct widths
	setBlockWidths();


	var data = {};
	var categoryArray = [1,2,3,4,5,6,7,8,9,10];
	var statesArray = [];
	var rangeLow  = [];
	var rangeHigh = [];
	
	data = {'categories': categoryArray,
			'province': statesArray,
			'rangeLow': rangeLow,
			'rangeHigh': rangeHigh			
	};
	

	jQuery.ajax ({
			url: rootDomain + 'explore.js?callback=?&variable=penis',
			type: 'JSON',
			//data: {'toSearch' : data },
			//crossDomain: true,
			success: function (response) {
		
			if(response.length > 0 ) {
				var content = '';
				var i = 0;
					
				//alert(response.length);
					
				for(i = 0; i < response.length; i++){
					content += '<div class="trip">Titel:' +response[i]['title']+ '   ';
					content += 'category_id:'+response[i]['id']+ '<br/>';
					content += 'Provincie:'  +response[i]['province']+ '</div>';					
				}	
			}
			else {
				var content = 'No results found';
			}
			// zet in je htmml
			jQuery('#results ul').html(content);
		}
	}); 


	/*
	jQuery.ajax({  
	    type: "GET",  
	    url: rootDomain,  
	    data: "toSearch{'province':'1','category_id':'2'}",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
		crossDomain: true
	});
	*/
	/*
	// test function
	jQuery.getJSON(rootDomain + 'trips.js?variable=tripsJSON&callback=?',
	  {
	    categories: 1,2,
	    searchQuery: "pieter",
		states: 1,2,3,
	    format: "json"
	  },
	  function(data) {

	  });
	  */
	  /*
	//Call all the trips
	jQuery.getJSON(rootDomain + 'explore.js?variable=tripsJSON&callback=?', function(data) {
		if (data) {
			//If data is returned, loop through it and create a listitem with the title of a trip.
			//An onclick will be fired if javascript is enabled, otherwise the user will be redirected to the page.
			for (var i in data) {
				if (data[i].title) {
					var listItem = '<li>\
						<a href="' + rootDomain + 'trips/' + data[i].id + '" onClick="getSingleItem(' + data[i].id + '); return false;">\
							' + data[i].title + '\
						</a>\
					</li>';
					jQuery("#list").append(listItem);
				}
			}
		}
	});

*/

});
function getSingleItem(id) {
	clearPath();
	jQuery.getJSON(rootDomain + 'explore/'+ id + '.js?variable=tripsJSON&callback=?', function(data) {
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
