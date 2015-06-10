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
	
	
	
}) //close ready