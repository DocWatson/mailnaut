// Require MailNaut Base Class
var MailNaut   = require('./controllers/MailNautController');

// expose the routes to our app with module.exports
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	app.post('/linkcheck/generate', function(req, res){
		MailNaut.generateReview(req, function (err, output) {
			if (!err) {
				//write the output
		    	res.render('linkcheck', {title: 'Review Links', output: output});
			} else {
				//render error template
				res.render('error', {error: err});
			}
			
		});
	});

	app.post('/plaintext/generate', function(req, res){
		MailNaut.generatePlaintext(req, function (err, output) {
			if (!err) {
				//write the output
		    	res.render('plaintext', {title: 'Plaintext Generated', output: output});
		    } else {
				//render error template
				res.render('error', {error: err});
			}
		});
	});

	app.post('/utm/generate', function(req, res){
		MailNaut.generateUTM(req, function (err, output) {
			if (!err) {
				//write the output
		    	res.render('utm', {title: 'UTM Generated', output: output});
	    	} else {
				//render error template
				res.render('error', {error: err});
			}
		});
	});

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

	app.get('/vendor', function(req, res) {
		res.render('includes/vendor', {num : req.query.num});
	});

	// All other requests, send 404
	app.get('*', function(req, res) {
		res.render('404', { title : 'We Have a Problem', section : '404' } );
	});
};