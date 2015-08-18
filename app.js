$(document).ready(function() {
	
	console.log('hello world');
	
	//init geocoder, so that it's ready to go
	var geocoder;
	var map;
	var municipality; 
	var addressDisplay;
	
	var currentNode = 0;
	
	//don't think I'm using these 
	var sections = [];
	
	//loader options
	var opts = {
		  lines: 11 // The number of lines to draw
		, length: 0 // The length of each line
		, width: 20 // The line thickness
		, radius: 49 // The radius of the inner circle
		, scale: 0.5 // Scales overall size of the spinner
		, corners: 1 // Corner roundness (0..1)
		, color: '#000' // #rgb or #rrggbb or array of colors
		, opacity: 0.25 // Opacity of the lines
		, rotate: 90 // The rotation offset
		, direction: 1 // 1: clockwise, -1: counterclockwise
		, speed: 0.9 // Rounds per second
		, trail: 60 // Afterglow percentage
		, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
		, zIndex: 2e9 // The z-index (defaults to 2000000000)
		, className: 'spinner' // The CSS class to assign to the spinner
		, top: '50%' // Top position relative to parent
		, left: '50%' // Left position relative to parent
		, shadow: false // Whether to render a shadow
		, hwaccel: false // Whether to use hardware acceleration
		, position: 'absolute' // Element positioning
	}
	
	//initialize geo stuff
	function initialize() {
	
	   geocoder = new google.maps.Geocoder();
	   console.log('initialized geocoder');
	   
	}

  initialize();
	
	//button states
	$('.button').click(function(e) {
		
		e.preventDefault();
		
		currentNode = parseInt($(this).closest('section').attr('class').split(' ')[0]);
		resetSubsequentNodes(currentNode);
		
		showModules($(this).attr('id'));	
		
		//of all the messy ways to implement a stupid toggle.
		var health_buttons = ['health-restroom', 'health-tanks', 'health-foodtrucks', 'health-foodsales'];
		
		if($(this).attr('id').split('-')[0] == 'health' && $(this).attr('id') != 'health-none') {
			
			$(this).addClass('active');
			buttonReset('health-none');
			
		} else if($(this).attr('id') == 'health-none') {
			
			for(var i = 0; i < health_buttons.length; i++) {
				
				buttonReset(health_buttons[i]);
				
			}
			
			$(this).addClass('active');
			
		} else {
			
			buttonReset($(this).attr('id'));
			$(this).addClass('active');

		}
				
	})
	
	//hide all subsequent sections from the current one
	//in case a user backs way up and changes an answer
	function resetSubsequentNodes(node) {
		
		$('section').each(function() {
			
			var nextNode = parseInt($(this).attr('class').split(' ')[0]);
			
			if(node < nextNode) {
				
				$(this).addClass('hidden');
				$(this).find('.button').each(function() {
				
					buttonReset($(this).attr('id'));
					
				})

			}
			
		})
	}	
	
	$("#address").keypress(function(event){
	    if(event.keyCode == 13){
	        $("#submit-address").click();
            return false;
	    }
	});

	//reset button visual states as needed
	function buttonReset(id) {
		
		$('.button').each(function() {
			
			if($(this).attr('id').split('-')[0] == id.split('-')[0]) {
				
				$(this).removeClass('active');
			}
		})
	}
	
	function resetFinishers() {
		
		$('.finished').addClass('hidden');	
	}
	
	function showHide(showThese, hideThose) {
		
		for(var i = 0; i < showThese.length; i++) {
			
			$(showThese[i]).removeClass('hidden');
		
			var showMe = $(showThese[i]).attr('id').toString().split('-')[0];
			
			console.log(showMe);
			
			if(showMe == 'finished'){
				
				$('#finished-print').removeClass('hidden');
			
			}
		}
		
		for(var i = 0; i < hideThose.length; i++) {
			
			$(hideThose[i]).addClass('hidden');
		}
	}
	
	//the body of the work
	function showModules(buttonID) {
		
		console.log('show module: ', buttonID);
		
		resetFinishers();
		
		switch(buttonID) {
			
			case 'public-yes':
			
				showHide(['#county-parks'], ['#ticket-sales']);
				break;
				
			case 'public-no':
			
				showHide(['#ticket-sales'], ['#county-parks','#geolocator', '#address', '#public-with-structures', '#certificate-of-use', '#street-closure', '#special-types', '#health']);
				break;
			
			case 'tickets-yes':
			
				showHide(['#county-parks'], ['#finished-not-public']);
				break;
				
			case 'tickets-no':
				
				showHide(['#finished-not-public'], ['#geolocator']);
				break;
				
			case 'address-yes':
				
				showHide(['form#address'], ['#no-address', '#umsa', '#county-parks']);
				break;
				
			case 'address-no':
			
				showHide(['#umsa'], ['form#address', '#address-value', '#public-with-structures']);
				$('#no-address .response').text("You don't have an address for your event yet.");
				break;
				
			case 'park-yes':
			
				showHide(['#finished-park'], ['#finished-success', '#finished-do-not-apply', '#finished-success', '#finished-not-sure', '#finished-no-structure', '#geolocator'])
				break;
				
			case 'park-no':
			
				showHide(['#geolocator'], [])
				break;
				
			case 'umsa-yes':
				
				showHide(['#public-with-structures'], [])
				break;
				
			case 'umsa-no':
			
				showHide(['#finished-do-not-apply'], [])
				break;
			
			case 'umsa-notSure':
			
				showHide(['#finished-not-sure'], [])
				break;
					
			case 'submit-address':
				
				var addy = $('input#input-address').val();
				
				//logic check to make sure that there's actually a value
				if(addy.length > 0) {
					
					showHide(['#address-value'], []);
					$("#address-value .value").text(addy);
					codeAddress(addy);
					
					//console.log('addy: ', $.type(addy), addy.length);
					
				} else {
					
					//what if there's no value? Error message.
					console.log("ERROR: no address entered");
				}

				break;
			
			case 'structure-yes':
			
				showHide(['#public-with-structures #public-yes', '#300-plus'],['#temporary-structure-definition']);
				break;
			
			case 'structure-no':
			
				showHide(['#finished-no-structure'],['#public-with-structures #public-yes', 'div#tent-yes', '#300-plus', '#temporary-structure-definition', 'div#tent-no']);
				break;
			
			case 'structure-whatIs':
			
				showHide(['#temporary-structure-definition'],[]);
				break;
			
			case 'tent-yes':
			
				showHide(['div#tent-yes', '#certificate-of-use'],['div#tent-no']);
				break;
			
			case 'tent-no':
			
				showHide(['div#tent-no', '#certificate-of-use'],['div#tent-yes']);
				break;
			
			case 'cu-no':
			
				showHide(['div#cu-no', '#street-closure'],['div#cu-yes', 'div#cu-notSure']);
				break;
			
			case 'cu-yes':
			
				showHide(['div#cu-yes', '#street-closure'],['div#cu-no', 'div#cu-notSure']);
				break;
				
			case 'cu-notSure':
			
				showHide(['div#cu-notSure', '#street-closure'],['div#cu-no', 'div#cu-yes']);
				break;
			
			case 'street-yes':
			
				showHide(['#special-types', 'div#street-yes'],['div#street-no','div#street-yesAgain']);
				break;
			
			case 'street-yesAgain':
			
				showHide(['#special-types', 'div#street-yesAgain'],['div#street-no', 'div#street-yes']);
				break;
			
			case 'street-no':
				
				showHide(['#special-types','div#street-no'],['div#street-yes', 'div#street-yesAgain']);
				break;
			
			case 'third-yes':
			
				showHide(['div#third-yes', 'div#types'],['div#third-no']);
				break;
				
			case 'third-no':
			
				showHide(['div#third-no', 'div#types'],['div#third-yes']);

				break;
				
			case 'type-sale':
			
				showHide(['#health', 'div#type-sale'],['div#type-carnival','div#type-assembly', 'div#type-sparkler']);
				break;
				
			case 'type-sparkler':
			
				showHide(['#health', 'div#type-sparkler'],['div#type-carnival', 'div#type-sale', 'div#type-assembly']);
				break;
				
			case 'type-carnival':
			
				showHide(['#health', 'div#type-carnival'],['div#type-sale', 'div#type-assembly', 'div#type-sparkler']);
				break;
				
			case 'type-assembly':
			
				showHide(['#health', 'div#type-assembly'],['div#type-sale','div#type-carnival', 'div#type-sparkler']);
				break;
				
			case 'type-none':
			
				showHide(['#health'],['div#type-assembly', 'div#type-sale','div#type-carnival', 'div#type-sparkler']);
				break;
				
			case 'health-restroom':
			
				showHide(['div#health-restroom','#finished-success'],['div#health-none']);
				break;
				
			case 'health-tanks':
			
				showHide(['div#health-restroom','#finished-success'],['div#health-none']);
				break;
				
			case 'health-foodtrucks':
			
				showHide(['div#health-foodtrucks','#finished-success'],['div#health-none']);
				break;
			
			case 'health-foodsales':
			
				showHide(['div#health-foodsales','#finished-success'],['div#health-none']);
				break;
				
			case 'health-none':
			
				showHide(['div#health-none','#finished-success'],['div#health-restroom','div#health-foodsales','div#health-foodtrucks']);
				break;
				
			case 'reset':
			
				location.reload();
				break;	
			
		}
	}
	
	/******************* GEOCODING ********************/
	
	function codeAddress(address) {
		
	   var lat;
	   var lng;
	   
	   //hacky loader to give user feedback
	   $("#loader").removeClass('hidden');
	   $('#loader').html("<h3>Please wait</h3><p>We're checking to see if your address is in unincorporated Miami-Dade County.</p>");
	   
	   //spinning loader graphic
	   var target = document.getElementById('loader')
	   var spinner = new Spinner(opts).spin(target);
	   
	    geocoder.geocode( { 'address': address,
		    				'componentRestrictions': {'administrativeArea' : 'Miami-Dade County'}  
							}, function(results, status) {
		    
	    	if (status == google.maps.GeocoderStatus.OK) {
		      
			    console.log(results[0].formatted_address);
			    addressDisplay = results[0].formatted_address;
			    //console.log("RESULTS");
			    //console.log(results);
			    
			    lat = results[0].geometry.location.lat();
			    lng = results[0].geometry.location.lng();
			    console.log(lat, lng);
				
				var latlng = new google.maps.LatLng(lat,lng);
				var mapOptions = {
				    center: latlng,
				    zoom: 11,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
				};
				    
				map = new google.maps.Map(document.getElementById("gMap"),
			    mapOptions);
			    
			    var marker = new google.maps.Marker({
				    position: latlng,
				    map: map,
				    title: 'Hello World!'
				})
								
			    //check to be sure this address is in Florida
			    
			    AIIM(lat, lng);
			   
		    } else {
		      
		        alert("Geocode was not successful for the following reason: " + status);
		      
		    }
		    
	    });
	    
	    //25.7753° N, 80.2089° W
	    
	}
	
	function printResults(results) {
		
		console.log('PRINTING RESULTS:');
		for (var i = 0; i < results.length; i++) {
			
			console.log(results[i].address_components[2] , ', ' , results[i].address_components[3], 'PARTIAL?', results[i].partial_match);
			
			console.log('LATLNG', results[i].geometry.location.A, results[i].geometry.location.F)
			
			if(results[i].partial_match != true) {
				
				
			}
		}
		
		
	}
	
	function AIIM(latitude, longitude) {
		
		console.log("THIS IS AM I IN MIAMI, ORIGINAL");
		
		$.ajax({
			url: "http://still-eyrie-4551.herokuapp.com/areas",
			data: {"lat":latitude, "lon":longitude, include_geom:false},
			dataType: "jsonp",
			contentType: "application/json; charset=utf-8",
			//jsonp: false
		}).done(function(data) {
			
			console.log('success, AIIM', data);
			
			if(data.features.length > 0) {
								
				municipality = data.features[0].properties.NAME;
				console.log("muni if not UMSA is: ", municipality);
				
			} else {
				
				console.log('what this returns if not muni:', data.features);
				municipality = 'UMSA';
			}
			
			console.log("THIS ENDS AM I IN MIAMI, ORIGINAL");
			
			showUMSA();
		})
		
	}
	
	function AIIMAgain(latitude, longitude) {
		
		console.log("AIIM Again", latitude, longitude);
		
		$.ajax({
			url: "http://census.codeforamerica.org/areas",
			data: {"lat":latitude, "lon":longitude, "include_geom":false, "layers":'place'},
			dataType: "jsonp",
			contentType: "application/json; charset=utf-8",
			//jsonp: false
			
		}).done(function(data) {
			
			console.log('success', data.features, data.features.length);
			
			/*if(data.features.length > 0) {
				
				municipality = data.features[0].properties.NAME;
				console.log("muni if not UMSA is: ", municipality);
			} else {
				
				console.log('what this returns if not muni:', data.features[0].properties.NAME);
				municipality = 'UMSA';
			}
			
			showUMSA();*/
		})
		
	}
	
	function showUMSA() {
		
		console.log('show UMSA:', municipality);
		
		//hide hacky loader
		$('#loader').addClass('hidden');
		
		var txt = addressDisplay;
		console.log('the address is:' , txt);
		
		if(municipality != 'UMSA') {
			
			$('#umsa').removeClass('hidden');
			$('form#address').addClass('hidden');	//in case someone hit 'yes' first.
			txt += '<br>This address is not in unincorporated Miami-Dade County.';
			showModules('umsa-no');
			
		} else {
			
			console.log('you are in umsa. continue.');
			//need a check for county park here.
			
			txt += '<br>This address is located in unincorporated Miami-Dade County.';
			showModules('umsa-yes');
		}
		
		$('#address-value .value').html(txt);
	}
	
	/******************* HAPPY PDF-ING ********************/
	
	$('#print').click(function() {
		
		var appended = 0; 
		
		$('#test-pdf').prepend("<h4>This is a record of your STEP information.</h4>")
				
		$('.module').each(function() {
			
			if($(this).hasClass('hidden') == false ) {
				
				$('#test-pdf').prepend($(this));
				appended++;
			}
			
		})
		
		if(appended == 0) {
			
			$('#test-pdf').append("It looks like we don't have any information specific to your case. ");
		}
		
		return xepOnline.Formatter.Format('test-pdf', {render:'newwin'});
			
	})
		
	
}) //close ready
