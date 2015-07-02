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
	
	$("#input-address").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#submit-address").click();
	    }
	});

	//still broken
	function buttonReset() {
		
		$('.button').each(function() {
			
			$(this).removeClass('active');
		})
	}
	
	function showHide(showThese, hideThose) {
		
		for(var i = 0; i < showThese.length; i++) {
			
			$(showThese[i]).removeClass('hidden');
		}
		
		for(var i = 0; i < hideThose.length; i++) {
			
			$(hideThose[i]).addClass('hidden');
		}
	}
	
	function showModules(buttonID) {
		
		console.log('show module: ', buttonID);
		switch(buttonID) {
			
			case 'address-yes':
				
				showHide(['form#address'], ['#no-address', '#umsa']);
				break;
				
			case 'address-no':
			
				showHide(['#umsa', '#no-address'], ['form#address']);
				$('#no-address .response').text("You don't have an address for your event yet.");
				break;
				
			case 'umsa-yes':
				
				showHide(['#county-parks'], [])
				break;
				
			case 'umsa-no':
			
				//showFinished();
				showHide(['#finished-do-not-apply'], [])
				console.log("END THE WIZARD");
				break;
			
			case 'umsa-notSure':
			
				showHide(['#finished-not-sure'], [])
				//$('#finished-not-sure').removeClass('hidden');
				console.log("END THE WIZARD");
				break;
			
			case 'park-yes':
			
				showHide(['#finished-park'], ['#finished-success', '#finished-do-not-apply', '#finished-success', '#finished-not-sure', '#finished-no-structure'])
				//$('#finished-park').removeClass('hidden');
				console.log("END THE WIZARD -- not enough info to continue. Send to parks.");
				break;
				
			case 'park-no':
			
				showHide(['#public-with-structures'], [])
				break;
			
			case 'submit-address':
				
				var addy = $('input#input-address').val();
				
				//logic check to make sure that there's actually a value
				if(addy.length > 0) {
					
					showHide(['#address-value'], []);
					$("#address-value .value").text(addy);
					codeAddress(addy);
					
					console.log('addy: ', $.type(addy), addy.length);
					
				} else {
					
					//what if there's no value? Error message.
					console.log("ERROR: no address entered");
				}

				break;
			
			case 'public-yes':
			
				showHide(['#public-with-structures #public-yes', '#300-plus'],['#temporary-structure-definition']);
				break;
			
			case 'public-no':
			
				showHide(['#finished-no-structure'],['div#tent-yes', '#300-plus', '#temporary-structure-definition']);
				break;
			
			case 'public-whatIs':
			
				console.log("what is a temporary structure?");
				showHide(['#temporary-structure-definition'],[]);
				break;
			
			case 'tent-yes':
			
				showHide(['div#tent-yes', '#certificate-of-use'],['div#tent-no']);
				break;
			
			case 'tent-no':
			
				showHide(['div#tent-no', '#certificate-of-use'],['div#tent-yes']);
				break;
			
			case 'cu-no':
			
				showHide(['div#cu-no', '#street-closure'],['div#cu-yes']);
				break;
			
			case 'cu-yes':
			
				showHide(['div#cu-yes', '#street-closure'],['div#cu-no']);
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
			
			case 'type-sale':
			
				showHide(['#health', 'div#type-sale'],['div#type-carnival','div#type-assembly']);
				break;
				
				
			case 'type-carnival':
			
				showHide(['#health', 'div#type-carnival'],['div#type-sale', 'div#type-assembly']);
				break;
				
				
			case 'type-assembly':
			
				showHide(['#health', 'div#type-assembly'],['div#type-sale','div#type-carnival']);
				break;
				
			case 'health-restroom':
			
				showHide(['div#health-restroom','#finished-success'],['div#health-foodsales','div#health-foodtrucks','div#health-none']);
				break;
				
			case 'health-tanks':
			
				showHide(['div#health-restroom','#finished-success'],['div#health-foodsales','div#health-foodtrucks','div#health-none']);
				break;
				
			case 'health-foodtrucks':
			
				showHide(['div#health-foodtrucks','#finished-success'],['div#health-restroom','div#health-foodsales','div#health-none']);
				break;
			
			case 'health-foodsales':
			
				showHide(['div#health-foodsales','#finished-success'],['div#health-restroom','div#health-foodtrucks','div#health-none']);
				break;
				
			case 'health-none':
			
				showHide(['div#health-none','#finished-success'],['div#health-restroom','div#health-foodsales','div#health-foodtrucks']);
				break;
			
		}
	}
	
	//end repetitive buttons
	
	function codeAddress(address) {
		
	   var lat;
	   var lng;
	   
	   //hacky loader to give user feedback
	   $("#loader").removeClass('hidden');
	   $('#loader').html("<h3>Please wait</h3><p>We're checking to see if your address is in unincorporated Miami-Dade County.</p>");
	   
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
		
		//hide hacky loader
		$('#loader').addClass('hidden');
		
		var txt = $('#address-value .value').text();
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
		
		//$('#county-parks').removeClass('hidden');
		
		$('#address-value .value').html(txt);
	}
	
	function showFinished() {
		
		$('.finished').each(function() {
			
			console.log('hiding finished');
			$(this).addClass('hidden');
		})
	}
	
	
}) //close ready