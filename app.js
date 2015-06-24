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
	})
	
	//still broken
	function buttonReset() {
		
		$('.button').each(function() {
			
			$(this).removeClass('active');
		})
	}
	
	//geocoding -- UMSA or not? buttons
	$('#address-yes').click(function(e){
		
		e.preventDefault();
		$('form#address').removeClass('hidden');
		$('#no-address').addClass('hidden');
		$('#umsa').addClass('hidden');
		
	})
	
	$('#address-no').click(function(e) {
		
		e.preventDefault();
		$('#umsa').removeClass('hidden');
		$('#no-address').removeClass('hidden');
		$('#no-address .response').text("You don't have an address for your event yet.");
		$('form#address').addClass('hidden');
	})
	
	$('#umsa-yes').click(function(e) {
		
		e.preventDefault();
		$('#county-parks').removeClass('hidden');
	})
	
	$('#umsa-no').click(function(e) {
		
		e.preventDefault();
		showFinished();
		$('#finished-do-not-apply').removeClass('hidden');
		console.log("END THE WIZARD");
	})
	
	$('#umsa-notSure').click(function(e) {
		
		e.preventDefault();
		$('#finished-not-sure').removeClass('hidden');
		console.log("END THE WIZARD");
	})
	
	$('#park-yes').click(function(e) {
		
		e.preventDefault();
		$('#finished-park').removeClass('hidden');
		console.log("END THE WIZARD -- not enough info to continue. Send to parks.");
	})
	
	$('#park-no').click(function(e) {
		
		e.preventDefault();
		$("#public-with-structures").removeClass('hidden');
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
	
	$('#public-yes.button').click(function(e) {
		
		console.log('public!');
		$('#public-with-structures #public-yes').removeClass('hidden');
		$('#300-plus').removeClass('hidden');
		$('#temporary-structure-definition').addClass('hidden');
		//$('.button#public-no').addClass('hidden');
		
	})
	
	$('.button#public-no').click(function(e) {
		
		//$('#public-no').removeClass('hidden');
		//$('.button#public-yes').addClass('hidden');
		$('div#tent-yes').addClass('hidden');
		
		$('#finished-no-structure').removeClass('hidden');
		$('#300-plus').addClass('hidden');	
		$('#temporary-structure-definition').addClass('hidden');
		
		//this ends the wizard. indicate that. 
		
	})
	
	$('.button#public-whatIs').click(function(e) {
		
		console.log("what is a temporary structure?");
		$('#temporary-structure-definition').removeClass('hidden');
		
	})
	
	$('.button#tent-yes').click(function(e) {
		
		$('div#tent-yes').removeClass('hidden');
		$('#certificate-of-use').removeClass('hidden');
	})
	
	$('.button#tent-no').click(function(e) {
		
		$('div#tent-yes').addClass('hidden');
		$('div#tent-no').removeClass('hidden');
		$('#certificate-of-use').removeClass('hidden');
		
	})
	
	$('#certificate-of-use .button').click(function(e) {
		
		$('#street-closure').removeClass("hidden");
		
	})
	
	$('.button#cu-no').click(function(e) {
		
		$('div#cu-no').removeClass('hidden');
		$('div#cu-yes').addClass('hidden');
	})
	
	$('.button#cu-yes').click(function(e) {
		
		$('div#cu-yes').removeClass('hidden');
		$('div#cu-no').addClass('hidden');
	})
	
	$('#street-closure .button').click(function(e) {
		
		$('#special-types').removeClass('hidden');
	})
	
	$('.button#street-yes').click(function(e) {
		
		$('div#street-yes').removeClass('hidden');
		$('div#street-no').addClass('hidden');
		$('div#street-yesAgain').addClass('hidden');
	})
	
	$('.button#street-yesAgain').click(function(e) {
		
		$('div#street-yesAgain').removeClass('hidden');
		$('div#street-no').addClass('hidden');
		$('div#street-yes').addClass('hidden');
	})
	
	$('.button#street-no').click(function(e) {
		
		$('div#street-yes').addClass("hidden");
		$('div#street-yesAgain').addClass('hidden');
		$('div#street-no').removeClass('hidden');
		
	})
	
	$('#special-types .button').click(function(e) {
		
		$('#health').removeClass('hidden');
	})
	
	$("#type-sale").click(function(e) {
		
		$('div#type-sale').removeClass('hidden');
		$('div#type-carnival').addClass('hidden');
		$('div#type-assembly').addClass('hidden');
	})
	
	$("#type-carnival").click(function(e) {
		
		$('div#type-sale').addClass('hidden');
		$('div#type-carnival').removeClass('hidden');
		$('div#type-assembly').addClass('hidden');
	})
	
	$("#type-assembly").click(function(e) {
		
		$('div#type-sale').addClass('hidden');
		$('div#type-carnival').addClass('hidden');
		$('div#type-assembly').removeClass('hidden');
	})
	
	$('#health .button').click(function(e) {
		
		
		$('#finished-success').removeClass('hidden');
	})
	
	$('#health-restroom').click(function(e) {
		
		$('div#health-restroom').removeClass('hidden');
		$('div#health-foodsales').addClass('hidden');
		$('div#health-foodtrucks').addClass('hidden');
		$('div#health-none').addClass('hidden');
		
	})
	
	$('#health-tanks').click(function(e) {
		
		$('div#health-restroom').removeClass('hidden');
		$('div#health-foodsales').addClass('hidden');
		$('div#health-foodtrucks').addClass('hidden');
		$('div#health-none').addClass('hidden');
		
	})
	
	$('#health-foodtrucks').click(function(e) {
		
		$('div#health-restroom').addClass('hidden');
		$('div#health-foodsales').addClass('hidden');
		$('div#health-foodtrucks').removeClass('hidden');
		$('div#health-none').addClass('hidden');
		
	})
	
	$('#health-foodsales').click(function(e) {
		
		$('div#health-restroom').addClass('hidden');
		$('div#health-foodsales').removeClass('hidden');
		$('div#health-foodtrucks').addClass('hidden');
		$('div#health-none').addClass('hidden');
		
	})
	
	$('#health-none').click(function(e) {
		
		$('div#health-restroom').addClass('hidden');
		$('div#health-foodsales').addClass('hidden');
		$('div#health-foodtrucks').addClass('hidden');
		$('div#health-none').removeClass('hidden');
		
	})
	
	
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
			
			$(this).addClass('hidden');
		})
	}
	
	function changed() {
		
		console.log("something was unhidden!");
	}
	
	
}) //close ready