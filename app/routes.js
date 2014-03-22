// expose the routes to our app with module.exports
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// TODO: add the methods to make this thing actually work.

	// application -------------------------------------------------------------
	// Render Index View
	app.get('/', function(req, res) {
		res.render('index', { title : 'Welcome', section : 'main' } ); 
	});

	// Render Plaintext Generator View
	app.get('/plaintext', function(req, res) {
		res.render('plaintext', { title : 'Generate a Plaintext Email', section : 'plaintext' } );
	});

	// Render UTM Inserter View
	app.get('/utm', function(req, res) {
		res.render('utm', { title : 'Insert UTM Codes', section : 'utm' } );
	});

	// Render Link Checker View
	app.get('/linkcheck', function(req, res) {
		res.render('linkcheck', { title : 'Check the Links', section : 'linkcheck' } );
	});

	// All other requests, send 404
	app.get('*', function(req, res) {
		res.render('404', { title : 'We Have a Problem', section : '404' } );
	});
};