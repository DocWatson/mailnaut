var fs         = require('fs');
var path       = require('path');	
var cheerio    = require('cheerio');	
var mkdirp     = require('mkdirp');
var htmlToText = require('html-to-text');
var zipstream  = require('zipstream');


//Extend arrays so we can remove empty values
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

// expose the routes to our app with module.exports
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	app.post('/linkcheck/generate', function(req, res){
		//console.log(req.files.htmlUpload);

		//Read the uploaded file
		fs.readFile(req.files.htmlUpload.path, function (err, data) {
			//load cheerio
		    var $ = cheerio.load(data);
		    // Get the title of the email
		    var links = [];
		    var href  = "";
		    var text  = "";
		    //walk over all the links and put their HREFs in line 
		    $('a').each(function(){
		    	// get the link and the text
		    	href = $(this).attr('href');
		    	text = $(this).text();

		    	//we do NOT want to exlude empty href values as we want to see if we missed configuring one
		    	links.push('['+href+'] '+ text);
		    	
		    });

		    //clean up any empty elements in the array
		    links.clean(undefined);
		    links.clean('');
		   
		   	//format the output
		   	var output = links.join("\r\n");

		   	//TODO: Add check to see if mobile viewport tag is included
		   	//TODO: Add check to see if the style tag is in the head or body

		    //write the output
		    res.render('linkcheck', {title: 'Review Links', output: output});
		});
	});

	app.post('/plaintext/generate', function(req, res){

		//Read the uploaded file
		fs.readFile(req.files.htmlUpload.path, function (err, data) {
			//load cheerio
		    var $ = cheerio.load(data);
		    // Get the title of the email
		    var subject = $('title').text();
		    var href    = '';
		    //walk over all the links and put their HREFs in line 
		    $('a').each(function(){
		    	href = $(this).attr('href');
		    	if (href != '') {
		    		$(this).text($(this).text() + ' ['+href+']');
		    	} else {
		    		$(this).text($(this).text() + ' [MISSING-LINK]');
		    	}
		    });

		    //get the final body copy after links have been prepared
		  	var body    = $('body').html();

		  	//convert to plain text
		  	var output = htmlToText.fromString(body);

		    //write the output
		    res.render('plaintext', {title: 'Plaintext Generated', output: output});
		});
	});

	app.post('/utm/generate', function(req, res){

		//Read the uploaded file
		fs.readFile(req.files.htmlUpload.path, function (err, data) {
			
		  	

		    //write the output
		    //res.render('plaintext', {title: 'Plaintext Generated', output: output});
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