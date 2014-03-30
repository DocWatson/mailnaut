var Mailnaut = {

	vendorTemplate: "<div class=\"vendor\"><label>Vendor Name<br><input type=\"text\" /></label><label>Subject Line<br><input type=\"text\" /></label><a href=\"#\" class=\"remove-vendor\"><i class=\"icon-cancel-circled2\">remove</i></a></div>",

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
		$('.add-vendor').click(function(e){
			e.preventDefault();
			$('.vendor-list').append(Mailnaut.vendorTemplate);
		});

		$('.vendor-list').on('click', '.remove-vendor', function(e){
			e.preventDefault();
			$(this).parent().remove();
		});
	}
}

$(document).ready(function(){
	Mailnaut.init();
});