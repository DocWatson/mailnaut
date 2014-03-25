var fs      = require('fs');
var path    = require('path');	
var cheerio = require('cheerio');	
var mkdirp  = require('mkdirp');
var S       = require('string');

// expose the routes to our app with module.exports
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// TODO: add the methods to make this thing actually work.
	app.post('/plaintext/generate', function(req, res){
		//console.log(req.files.htmlUpload);

		//Read the uploaded file
		fs.readFile(req.files.htmlUpload.path, function (err, data) {
			//load cheerio
		    var $ = cheerio.load(data);
		    // Get the title of the email
		    var subject = $('title').text();

		    //walk over all the links and put their HREFs in line 
		    $('a').each(function(){
		    	$(this).text($(this).text() + ' ['+$(this).attr('href')+']');
		    });

		    //get the final body copy after links have been prepared
		  	var body    = $('body').html();

		  	// Strip the tags
		  	body = S(body).collapseWhitespace();
		  	var output = S(body).stripTags().s;
		  	
		  	// Replace special chars to something a little cleaner
		  	output = S(output).replaceAll('&copy;', '(C)').s;
		  	output = S(output).replaceAll('&reg;', '(R)').s;
		  	output = S(output).replaceAll('&nbsp;', ' ').s;

		  	// Try to format properly
		  	output = output.replace(/\s{4}/g,"\r\n");
		  	

		  	//output = output.replace(/`+/g,"\r\n\r\n");
		    console.log(output);

		    //write the output
		    res.send(output);
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

	// All other requests, send 404
	app.get('*', function(req, res) {
		res.render('404', { title : 'We Have a Problem', section : '404' } );
	});
};