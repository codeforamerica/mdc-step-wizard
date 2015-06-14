$(document).ready(function() {
	
	console.log('hello world');
	
	//init geocoder, so that it's ready to go
	var geocoder;
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
	
	//geocoding
	$('#address-yes').click(function(e){
		
		e.preventDefault();
		$('form#address').removeClass('hidden');
		
	})
	
	$('#submit-address').click(function(e) {
		
		e.preventDefault();
		var addy = $('input').val();
		
		console.log('addy: ', addy);

		codeAddress(addy);
		
	})
	
	function codeAddress(address) {
		
	   // address = address;
	   var lat;
	   var lng;
	   
	    geocoder.geocode( { 'address': address}, function(results, status) {
		    
	    	if (status == google.maps.GeocoderStatus.OK) {
		      
			    //console.log(results[0].geometry.location);
			    //console.log(results);
			
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
		})
		
	}
	
	
}) //close ready