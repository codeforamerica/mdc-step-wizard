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
	
	$('.button').click(function(e) {
		
		e.preventDefault();
		
		var id = $(this).attr('id');
			//console.log(id);
			
		showModule(id);
	})
	
	function showModule(id) {
		
		//console.log('show module:', $('.module'));
		
		//hide unhidden modules
		$('.module').each(function() {
			
			//console.log($(this), ' o hai');
			if( $(this).hasClass('.hidden') == false ) {
			
				console.log('module not hidden');
			}
			
			if($(this).attr('id') == id) {
				
				$(this).removeClass('hidden');
				console.log('show me!', $(this).attr('id'))	
			
			}
		});
		
	}
	
	//geocoding -- UMSA or not? buttons
	$('#address-yes').click(function(e){
		
		e.preventDefault();
		$('form#address').removeClass('hidden');
		
	})
	
	$('#address-no').click(function(e) {
		
		e.preventDefault();
		
		
		municipality = 'miami';
		showUMSA();
	})
	
	$('#submit-address').click(function(e) {
		
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
			
	})
	
	$('.button#public-yes').click(function(e) {
		
		$('#public-yes').removeClass('hidden');
		//$('.button#public-no').addClass('hidden');
		
	})
	
	$('.button#public-no').click(function(e) {
		
		$('#public-no').removeClass('hidden');
		$('.button#public-yes').addClass('hidden');
		$('div#tent-yes').addClass('hidden');
		
		//this ends the wizard. indicate that. 
		
	})
	
	$('.button#public-whatIs').click(function(e) {
		
		console.log("what is a temporary structure?");
		
	})
	
	$('.button#tent-yes').click(function(e) {
		
		$('#certificate-of-use').removeClass('hidden');
	})
	
	$('.button#tent-no').click(function(e) {
		
		$('div#tent-yes').addClass('hidden');
		$('div#tent-no').removeClass('hidden');
		
	})
	
	$('#certificate-of-use .button').click(function(e) {
		
		$('#street-closure').removeClass("hidden");
		
	})
	
	$('#street-closure .button').click(function(e) {
		
		$('#special-types').removeClass('hidden');
	})
	
	$('.button#street-yes').click(function(e) {
		
		$('#street-yes').removeClass('hidden');
	})
	
	$('.button#street-yesAgain').click(function(e) {
		
		$('#street-yesAgain').removeClass('hidden');
	})
	
	$('.button#street-no').click(function(e) {
		
		$('div#street-yes').addClass("hidden");
		$('div#street-no').removeClass('hidden');
		
	})
	
	$('#special-types .button').click(function(e) {
		
		$('#health').removeClass('hidden');
	})
	
	$('#health .button').click(function(e) {
		
		
		$('#finished').removeClass('hidden');
	})
	
	
	
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
		if(municipality != 'UMSA') {
			
			$('#umsa').removeClass('hidden');
			$('form#address').addClass('hidden');	//in case someone hit 'yes' first.
		
		} else {
			
			console.log('you are in umsa. continue.');
			//need a check for county park here.
			
			$('#public-with-structures').removeClass('hidden');
		}
	}
	
	
}) //close ready