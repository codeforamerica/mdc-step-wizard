$(document).ready(function() {
	
	console.log('hello world');
	
	//init geocoder, so that it's ready to go
	var geocoder;
	var municipality; 
	
	//var map;
	
	function initialize() {
	
	   geocoder = new google.maps.Geocoder();
	   console.log('initialized geocoder');
	   
	}

  	initialize();
	
	//button states
	$('.button').click(function(e) {
		
		e.preventDefault();
		buttonReset();
		$(this).addClass('active');
		showModules($(this).attr('id'));	
	})
	
	//still broken
	function buttonReset() {
		
		$('.button').each(function() {
			
			$(this).removeClass('active');
		})
	}
	
	function showModules(buttonID) {
		
		console.log('show module: ', buttonID);
		switch(buttonID) {
			
			case 'address-yes':
				$('form#address').removeClass('hidden');
				$('#no-address').addClass('hidden');
				$('#umsa').addClass('hidden');
				break;
				
			case 'address-no':
				$('#umsa').removeClass('hidden');
				$('#no-address').removeClass('hidden');
				$('#no-address .response').text("You don't have an address for your event yet.");
				$('form#address').addClass('hidden');
				break;
				
			case 'umsa-yes':
				
				$('#county-parks').removeClass('hidden');
				break;
				
			case 'umsa-no':
			
				showFinished();
				$('#finished-do-not-apply').removeClass('hidden');
				console.log("END THE WIZARD");
				break;
			
			case 'umsa-notSure':
			
				$('#finished-not-sure').removeClass('hidden');
				console.log("END THE WIZARD");
				break;
			
			case 'park-yes':
			
				$('#finished-park').removeClass('hidden');
				console.log("END THE WIZARD -- not enough info to continue. Send to parks.");
				break;
				
			case 'park-no':
			
				$("#public-with-structures").removeClass('hidden');
				break;
			
			case 'submit-address':
				
				e.preventDefault();
		
				var addy = $('input#input-address').val();
				
				//logic check to make sure that there's actually a value
				if(addy.length > 0) {
					
					$("#address-value").removeClass('hidden');
					$("#address-value .value").text(addy);
					codeAddress(addy);
					
					console.log('addy: ', $.type(addy), addy.length);
					
				} else {
					
					//what if there's no value? Error message.
					console.log("ERROR: no address entered");
				}

				break;
			
			case 'public-yes':
			
				console.log('public!');
				$('#public-with-structures #public-yes').removeClass('hidden');
				$('#300-plus').removeClass('hidden');
				$('#temporary-structure-definition').addClass('hidden');
				//$('.button#public-no').addClass('hidden');
				break;
			
			case 'public-no':
			
				//$('#public-no').removeClass('hidden');
				//$('.button#public-yes').addClass('hidden');
				$('div#tent-yes').addClass('hidden');
		
				$('#finished-no-structure').removeClass('hidden');
				$('#300-plus').addClass('hidden');	
				$('#temporary-structure-definition').addClass('hidden');
		
				//this ends the wizard. indicate that. 
				break;
			
			case 'public-whatIs':
			
				console.log("what is a temporary structure?");
				$('#temporary-structure-definition').removeClass('hidden');
				break;
			
			case 'tent-yes':
			
				$('div#tent-yes').removeClass('hidden');
				$('#certificate-of-use').removeClass('hidden');
				break;
			
			case 'tent-no':
			
				$('div#tent-yes').addClass('hidden');
				$('div#tent-no').removeClass('hidden');
				$('#certificate-of-use').removeClass('hidden');
				break;
			
			case 'cu-no':
			
				$('div#cu-no').removeClass('hidden');
				$('div#cu-yes').addClass('hidden');
				$('#street-closure').removeClass('hidden');
				break;
			
			case 'cu-yes':
			
				$('div#cu-yes').removeClass('hidden');
				$('div#cu-no').addClass('hidden');
				$('#street-closure').removeClass('hidden');
				break;
			
			case 'street-yes':
			
				$('#special-types').removeClass('hidden');
				$('div#street-yes').removeClass('hidden');
				$('div#street-no').addClass('hidden');
				$('div#street-yesAgain').addClass('hidden');
				break;
			
			case 'street-yesAgain':
			
				$('#special-types').removeClass('hidden');
				$('div#street-yesAgain').removeClass('hidden');
				$('div#street-no').addClass('hidden');
				$('div#street-yes').addClass('hidden');
				break;
			
			case 'street-no':
				
				$('#special-types').removeClass('hidden');
				$('div#street-yes').addClass("hidden");
				$('div#street-yesAgain').addClass('hidden');
				$('div#street-no').removeClass('hidden');
				break;
			
			case 'type-sale':
			
				$('#health').removeClass('hidden');
				$('div#type-sale').removeClass('hidden');
				$('div#type-carnival').addClass('hidden');
				$('div#type-assembly').addClass('hidden');
				break;
				
				
			case 'type-carnival':
			
				$('#health').removeClass('hidden');
				$('div#type-sale').addClass('hidden');
				$('div#type-carnival').removeClass('hidden');
				$('div#type-assembly').addClass('hidden');
				break;
				
				
			case 'type-assembly':
			
				$('#health').removeClass('hidden');
				$('div#type-sale').addClass('hidden');
				$('div#type-carnival').addClass('hidden');
				$('div#type-assembly').removeClass('hidden');
				break;
				
			case 'health-restroom':
			
				$('div#health-restroom').removeClass('hidden');
				$('div#health-foodsales').addClass('hidden');
				$('div#health-foodtrucks').addClass('hidden');
				$('div#health-none').addClass('hidden');
				$('#finished-success').removeClass('hidden');
				break;
				
			case 'health-tanks':
			
				$('div#health-restroom').removeClass('hidden');
				$('div#health-foodsales').addClass('hidden');
				$('div#health-foodtrucks').addClass('hidden');
				$('div#health-none').addClass('hidden');
				$('#finished-success').removeClass('hidden');
				break;
				
			case 'health-foodtrucks':
			
				$('div#health-restroom').addClass('hidden');
				$('div#health-foodsales').addClass('hidden');
				$('div#health-foodtrucks').removeClass('hidden');
				$('div#health-none').addClass('hidden');
				$('#finished-success').removeClass('hidden');
				break;
			
			case 'health-foodsales':
			
				$('div#health-restroom').addClass('hidden');
				$('div#health-foodsales').removeClass('hidden');
				$('div#health-foodtrucks').addClass('hidden');
				$('div#health-none').addClass('hidden');
				$('#finished-success').removeClass('hidden');
				break;
				
			case 'health-none':
			
				$('div#health-restroom').addClass('hidden');
				$('div#health-foodsales').addClass('hidden');
				$('div#health-foodtrucks').addClass('hidden');
				$('div#health-none').removeClass('hidden');
				$('#finished-success').removeClass('hidden');
				break;
				
				
			
		}
	}
	
	//end repetitive buttons
	
	function codeAddress(address) {
		
	   var lat;
	   var lng;
	   
	    geocoder.geocode( { 'address': address}, function(results, status) {
		    
	    	if (status == google.maps.GeocoderStatus.OK) {
		      
			    //console.log(results[0].geometry.location);
			    console.log(results);
			
				lat = results[0].geometry.location.A;
			    lng = results[0].geometry.location.F;
			    
			    console.log(lat, lng);
			    AIIM(lat, lng);		//am I in miami?

		    } else {
		      
		        alert("Geocode was not successful for the following reason: " + status);
		      
		    }
		    
	    });
	    
	    	    
	}
	
	function AIIM(latitude, longitude) {
		
		console.log("AIIM", latitude, longitude);
		
		$.ajax({
			url: "http://still-eyrie-4551.herokuapp.com/areas",
			data: {"lat":latitude, "lon":longitude, "include_geom":false},
			dataType: "jsonp",
			contentType: "application/json; charset=utf-8",
			//jsonp: false
		}).done(function(data) {
			
			console.log('success', data);
			
			if(data.features.length > 0) {
				
				municipality = data.features[0].properties.NAME;
				
			} else {
				
				municipality = 'UMSA';
			}
			
			showUMSA();
		})
		
	}
	
	function showUMSA() {
		
		console.log('show UMSA:', municipality);
		
		var txt = $('#address-value .value').text();
		console.log('the address is:' , txt);
		
		if(municipality != 'UMSA') {
			
			$('#umsa').removeClass('hidden');
			$('form#address').addClass('hidden');	//in case someone hit 'yes' first.
			txt += '<br>This address is not in unincorporated Miami-Dade County.';
		
		} else {
			
			console.log('you are in umsa. continue.');
			//need a check for county park here.
			
			//$('#public-with-structures').removeClass('hidden');
			txt += '<br>This address is located in unincorporated Miami-Dade County.';
		}
		
		$('#county-parks').removeClass('hidden');
		$('#address-value .value').text(txt);
	}
	
	function showFinished() {
		
		$('.finished').each(function() {
			
			console.log('hiding finished');
			$(this).addClass('hidden');
		})
	}
	
	
}) //close ready