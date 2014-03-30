var Mailnaut = {
	displayVendorRemove : function() {
		if( $('.remove-vendor').length > 1 ) {
			$('.remove-vendor').show();
		} else {
			$('.remove-vendor').hide();
		}
	},

	init: function () {
		//get the form
		Mailnaut.targetForm   = $('form[name="mailnautForm"]');
		//determine its action and relevance
		Mailnaut.formAction   = Mailnaut.targetForm.attr('action');
		Mailnaut.formFunction = Mailnaut.targetForm.attr('rel');

		switch (Mailnaut.formFunction) {
        	case 'plaintext':
        		Mailnaut.targetForm.submit(function (e) {
        			Mailnaut.processPlaintext();
        		});
        		break;
        	case 'utm':
        		Mailnaut.setupVendorControls();

        		Mailnaut.targetForm.submit(function (e) {
        			Mailnaut.processUTM();
        		});
        		break;
        	case 'linkcheck':
        		Mailnaut.targetForm.submit(function (e) {
        			Mailnaut.processLinkcheck();
        		});
        		break;
        	default :
        		console.log("No action specified");
        }
	},

	processPlaintext: function () {
		console.log('Executing Plaintext Generation');

		//TODO: handle AJAX upload
		$.post(Mailnaut.formAction, Mailnaut.targetForm.serialize(), function(response){
			//console.log(responses);
		});
	},

	processLinkcheck: function () {
		console.log('Executing Link Check');
		$.post(Mailnaut.formAction, Mailnaut.targetForm.serialize(), function(response){
			//console.log(responses);
		});
	},

	processUTM: function () {
		$.post(Mailnaut.formAction, Mailnaut.targetForm.serialize(), function(response){
			//console.log(responses);
		});
	},

	setupVendorControls: function() {
		Mailnaut.displayVendorRemove();
		$('.add-vendor').click(function(e){
			e.preventDefault();
			$.get('/vendor', function(data){
				$('.vendor-list').append(data);
				Mailnaut.displayVendorRemove();
			});
			
		});

		$('.vendor-list').on('click', '.remove-vendor', function(e){
			e.preventDefault();
			$(this).parent().remove();
			Mailnaut.displayVendorRemove();
		});
	}
}

$(document).ready(function(){
	Mailnaut.init();
});