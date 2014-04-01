/**
 * MailNautController
 *
 * @module      :: Controller
 * @description	:: The core set of functions for the app.
 *
 */

// Dependencies
var fs         = require('fs');
var path       = require('path');	
var cheerio    = require('cheerio');	
var mkdirp     = require('mkdirp');
var htmlToText = require('html-to-text');
var zipstream  = require('zipstream');

var writePath = path.join(__dirname + '/output/');

//make the writePath work
mkdirp(writePath, function(err) { 
    if(err){
    	console.log('Could not write to path: '+writePath);
    }
});

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

module.exports = { 
	/**
	 * generatePlaintext 
	 * function to parse uploaded HTML file and return the plaintext version
	 * 
	 * @param  {Object}   req      the post request object
	 * @param  {Function} callback function to run when operation is complete
	 * @return {Void}          
	 */
	generatePlaintext : function (req, callback) {
		//Read the uploaded file
		fs.readFile(req.files.htmlUpload.path, function (err, data) {
			if (err) {
				callback(err);
			} else {
				//load cheerio
			    var $ = cheerio.load(data);

			    // Get the title of the email
			    var subject = $('title').text().toUpperCase();
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

			    // get the final body copy after links have been prepared
			  	var body    = $('body').html();
			  	// attempt plaintext conversion
			  	var output  = htmlToText.fromString(body);

			  	// add in subject line
			  	var output = subject + "\r\n ================================== \r\n" + output;
			  	// send output back to view for template rendering
			  	callback(err, output);
			}
			
		});
	},
	/**
	 * generateReview
	 * function to parse the uploaded HTML file and return all the links found
	 * 
	 * @param  {Object}   req      the post request object
	 * @param  {Function} callback function to run when the operation is complete
	 * @return {Void}            
	 */
	generateReview : function (req, callback) {
		//Read the uploaded file
		fs.readFile(req.files.htmlUpload.path, function (err, data) {
			if (err) {
				callback(err);
			} else {
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

			   	//send the output back to the route for view rendering
			   	callback(err,output);

			   	//TODO: Add check to see if mobile viewport tag is included
			   	//TODO: Add check to see if the style tag is in the head or body
			}
		});
	},

	/**
	 * generateUTM description
	 * function to parse the uploaded HTML file and insert UTM codes based on specified vendors
	 *   outputs a zip archive of all of the files
	 *   
	 * @param  {Object}   req      the post request object
	 * @param  {Function} callback callback function to run when operation is complete
	 * @return {Void}            
	 */
	generateUTM : function (req, callback) {
		//Read the uploaded file
		fs.readFile(req.files.htmlUpload.path, function (err, data) {
			if (err) {
				callback(err);
			} else {
				//load cheerio
			    var $ = cheerio.load(data);

			    var subject = $('title').text();
			    
			    var campaign         = '';
			    var default_campaign = subject.replace(/\s+/g, '-');
			    var utm_string       = '?utm_medium=email';
			    var source           = '';
			    console.log('Pre loop');
			    //Loop through all the vendors and build out the utm string
				for(var i=0; i < req.body.vendor_name[0].length; i++) {
					console.log('Looping' + i);
					source = req.body.vendor_name[0][i].toString().toLowerCase();

					//if we have a custom subject line for this vendor, use it; otherwise, use default
					if (req.body.vendor_subject[0][i] !== '' && req.body.vendor_subject[0][i] !== undefined) {
						campaign = req.body.vendor_subject[0][i].replace(/\s+/g, '-');
					} else {
						campaign = default_campaign;
					}

					//smash it all together
					utm_string = utm_string + '&utm_source=' + source + '&utm_campaign='+campaign;

					console.log(utm_string);

					//loop through all the links
					$('a').each(function() {
						//get the HREF
						href = $(this).attr('href');

						//append the UTM string and set the content
						href = href + utm_string + '&utm_content=' + href;

						//reset the href
						$(this).attr('href',href);
					});

					console.log('Preparing File write to: '+ writePath + source + '.html');
					fs.writeFile(writePath + source + '.html', $.html(), function(err){
		                if(!err){
		                    console.log('File successfully written!');
		                } else {
		                    console.log('ERROR with file: ');
		                }
			        });
				}

				var output = $.html();

				callback(err,output);
			}
		});
	}

}