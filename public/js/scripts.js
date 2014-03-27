var Mailnaut = {
	addVendor : function() {

	},

	init: function () {
		//get the form
		Mailnaut.targetForm   = $('form[name="mailnautForm"]');
		//determine its action and relevance
		Mailnaut.formAction   = Mailnaut.targetForm.attr('action');
		Mailnaut.formFunction = Mailnaut.targetForm.attr('rel');

		Mailnaut.targetForm.submit(function (event) {
			//prevent default submit event
            //event.preventDefault();
            //run the desired action for each form type
            switch (Mailnaut.formFunction) {
            	case 'plaintext':
            		Mailnaut.processPlaintext();
            		break;
            	case 'utm':
            		Mailnaut.processUTM();
            		break;
            	case 'linkcheck':
            		Mailnaut.processLinkcheck();
            		break;
            	default :
            		console.log("No action specified");
            }
        });
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

	removeVendor: function() {
		$('.remove').on('click', function(e){
			e.preventDefault();
		});
	}
}

$(document).ready(function(){
	Mailnaut.init();
});