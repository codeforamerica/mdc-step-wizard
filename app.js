$(document).ready(function() {
	
	console.log('hello world');
	
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
		var url = 'http://gisws.miamidade.gov/gisaddress/addresswebservice.asmx/Address?myAddress=' + addy;
		console.log('addy: ', addy, url);
		
		
		/*$.ajax({
			url: "http://gisws.miamidade.gov/gisaddress/addresswebservice.asmx/Address",
			  context: document.body
			}).done(function() {
			  $( this ).addClass( "done" );
			});
		
		
		$.ajax({
                url: createCORSRequest('POST', 'http://gisws.miamidade.gov/gisaddress/addresswebservice.asmx/Address'),
                dataType: 'text/xml',
                type: 'POST',
                
                success: function( data, textStatus, jQxhr ){
                    $('#response pre').html( data );
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
            });*/
                        
            var xhr = createCORSRequest('POST', url);
			
			if (!xhr) {
				  throw new Error('CORS not supported');
			}
			xhr.send();

			
			/*$.ajax({

				  // The 'type' property sets the HTTP method.
				  // A value of 'PUT' or 'DELETE' will trigger a preflight request.
				  type: 'GET',
				  
				
				  // The URL to make the request to.
				  url: url,
				
				  // The 'contentType' property sets the 'Content-Type' header.
				  // The JQuery default for this property is
				  // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
				  // a preflight. If you set this value to anything other than
				  // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
				  // you will trigger a preflight request.
				  contentType: 'application/x-www-form-urlencoded',
				  
				  xhrFields: {
				    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
				    // This can be used to set the 'withCredentials' property.
				    // Set the value to 'true' if you'd like to pass cookies to the server.
				    // If this is enabled, your server must respond with the header
				    // 'Access-Control-Allow-Credentials: true'.
				    withCredentials: false
				  },
				
				  headers: {
				    // Set any custom headers here.
				    // If you set any non-simple headers, your server must include these
				    // headers in the 'Access-Control-Allow-Headers' response header.
				  },
				
				  success: function() {
				    // Here's where you handle a successful response.
				    console.log('success');
				  },
				
				  error: function() {
				    // Here's where you handle an error response.
				    // Note that if the error was due to a CORS issue,
				    // this function will still fire, but there won't be any additional
				    // information about the error.
				    console.log('fail');
				  }
				});*/

		
	})
	
	function createCORSRequest(method, url) {
		  var xhr = new XMLHttpRequest();
		  if ("withCredentials" in xhr) {
		
		    // Check if the XMLHttpRequest object has a "withCredentials" property.
		    // "withCredentials" only exists on XMLHTTPRequest2 objects.
		    xhr.open(method, url, true);
		
		  } else if (typeof XDomainRequest != "undefined") {
		
		    // Otherwise, check if XDomainRequest.
		    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		    xhr = new XDomainRequest();
		    xhr.open(method, url);
		
		  } else {
		
		    // Otherwise, CORS is not supported by the browser.
		    xhr = null;
		
		  }
		  return xhr;
		}
		
		/*var xhr = createCORSRequest('GET', url);
		
		*/
	
	
	
	
}) //close ready