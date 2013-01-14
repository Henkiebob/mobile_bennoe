var rootDomain = 'http://www.bennoe.nl';


//Create a global data var to keep the data from the trip. This way there's only one call needed at first
//And never again after.
var globalData = '';

//Set global settings for width and height(In percentage) for the map
var mapWidthPercentage = 80;
var mapHeightPercentage = 60;


jQuery(function() {
	//Call initial functions
	//Hide address bar hides the address bar on mobile devices(If the content is higher than the deviceHeight)
	hideAddressBar();

	//Set the blocks to the correct widths
	setBlockWidths();

	findHashtag();

	jQuery('#startRoute').click( function() {
		goToStep(1);
	});
});

function goToStep(stepNumber) {
	if (stepNumber == undefined || stepNumber == 0) {
		alert("Deze stap is ongeldig. U wordt terug gestuurd naar de lijst");
		window.location = 'index.html';
	}
	if (globalData) {

		var currentStep = jQuery("#currentStep").html();
		if (currentStep == "") {
			currentStep = 1;
		}

		currentStep = parseFloat(currentStep);

		//Get the tripLocations up to the currentstep
		var tripLocations = getTripLocationsUpToCurrentStep(currentStep-1);

		if(tripLocations == false) {
			alert("U bent aan het einde van de route!");
		} else if (tripLocations.length > 0) {
			createMap(tripLocations, mapWidthPercentage, mapHeightPercentage);
		} else {
			alert("Oeps, er ging iets fout!");
		}

		//Higher the currentstep by 1
		jQuery("#currentStep").html(currentStep+1);
	} else {
		alert("Geen route gevonden");
	}
}

function getTripLocationByStepnumber(step) {
	var tripLocation = globalData.triplocations[step];
	if (tripLocation) {
		return tripLocation;
	} else {
		//If a triplocation isnt found, and the Step is the current step minus 1(Because how the array is built)
		//The function will be returned to the function where it came from but with a stepNumber 1 lower than the current.
		//This will go on until the stepNumber is found or hits 0.
		goToStep(step);
	}
}

function getTripLocationsUpToCurrentStep(step) {
	if (step >= globalData.triplocations.length) {
		return false;
	}
	var tripLocArray = [];
	for (var i = 0; i <= globalData.triplocations.length; i++) {
		if (i <= step){
			tripLocArray.push(globalData.triplocations[i]);
		} else {
			return tripLocArray;
		}
	}

}

function findHashtag() {
	var hash = window.location.hash;
	hash = hash.substr(1);
	getRoute(hash);
}

function getRoute(id) {
	clearPath();
	jQuery.getJSON(rootDomain + '/trips/'+ id + '.js?variable=routeJSON&callback=?', function(data) {
		if (data) {
			globalData = data;
			//Define the blocks that need to be filled
			var titleBlock = jQuery('.title');
			var descriptionBlock = jQuery('.description');

			//Empty the blocks, just to be safe.
			titleBlock.html('');
			descriptionBlock.html('');
			
			titleBlock.html(data.title);
			descriptionBlock.html(data.description);

			//Create the map according to the locations
			createMap(data.triplocations, mapWidthPercentage, mapHeightPercentage);
		}
	});
}