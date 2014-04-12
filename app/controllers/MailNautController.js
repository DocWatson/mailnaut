/**
 * MailNautController
 *
 * @module      :: Controller
 * @description	:: The core set of functions for the app.
 *
 */

// Dependencies
var fs         = require('fs');
var cheerio    = require('cheerio');	
var htmlToText = require('html-to-text');
var mime       = require('mime');
var packer     = require('zip-stream');
var config     = require('../config');

//make sure the write path exists
config.makeWritePath();

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

// expose the controller to the app with module.exports
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
	 * generateUTM
	 * function to parse the uploaded HTML file and insert UTM codes based on specified vendors
	 *   outputs a zip archive of all of the files
	 *   
	 * @param  {Object}   req      the post request object
	 * @param  {Function} callback callback function to run when operation is complete
	 * @return {Void}            
	 */
	generateUTM : function (req, callback) {
		//default: zip the output up
		var zip = true;

		//if the user has opted not to zip, set it here
		if (req.body.noZip) {
			zip = false;
		}
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
			    var utm_medium       = '?utm_medium=email';
			    var source           = '';

			    //convert the submitted vendor object to a usable array
			    var vendors = Array.prototype.slice.call(req.body.vendors);

			    //loop through the vendors
			    vendors.forEach(function(vendor){
			    	source = vendor.name.toString().toLowerCase().replace(/\s+/g, '-');

					//if we have a custom subject line for this vendor, use it; otherwise, use default
					if (vendor.subject !== '' && vendor.subject !== undefined) {
						campaign = vendor.subject.replace(/\s+/g, '-');
					} else {
						campaign = default_campaign;
					}

					//smash it all together
					var utm_string = utm_medium + '&utm_source=' + source + '&utm_campaign='+campaign;

					//reload cheerio (attempt to remove dupe HREFs)
					var $ = cheerio.load(data);

					//insert the UTM string for each HREF
					// TO DO: prevent this from duplicating values..hmmm
					$('a').each(function(){
						var href = $(this).attr("href"); 
						$(this).attr('href', href + utm_string + '&utm_content=' + href);
					});
					
					var text_version  = htmlToText.fromString($.html());

					console.log('Preparing File write to: '+ config.writePath + source + '.html');


					// if the user has elected to not zip the files, simply output them
					if(!zip) {
						//write the HTML version using Cheerio's DOM
						fs.writeFile(config.writePath + source + '.html', $.html(), function(err){
			                if(!err){
			                    console.log('File successfully written!');
			                } else {
			                    console.log('ERROR with file: ' + source + '.html');
			                    console.log('ERROR output: '+ err);
			                }
				        });

						// write the text version using html-to-string on Cheerio's DOM
				        fs.writeFile(config.writePath + source + '.txt', text_version, function(err){
			                if(!err){
			                    console.log('File successfully written!');
			                } else {
			                    console.log('ERROR with file: ' + source + '.text');
			                    console.log('ERROR output: '+ err);
			                }
				        });
					} else {
						//create an output stream and archiver
						var out     = fs.createWriteStream(config.writePath + source + '.zip');
						var archive = new packer(); 

						//pipe the output into the archiver
						archive.pipe(out);

						// prepare archiver 
						archive.on('error', function(err) {
						  throw err;
						});

						//add the html and text versions to an output zip of the same name
					    archive.entry(text_version, { name: source + '.txt' }, function(err, entry) {
						  	if (err) throw err;
						  	archive.entry($.html(), { name: source + '.html' }, function(err, entry) {
						    	if (err) throw err;
						    	archive.finalize();
						  	});
						});
					}
			    });
				
				// TODO: provide download links on the callback page
				callback(err,vendors);
			}
		});
	},

	/**
	 * getZipDownload 
	 * function to read a URL path, then serve up the download
	 * 
	 * @param  {String} path - the download request path
	 * @param  {Object} res  - express's response object so we can write the file out
	 * @return {File}   streams the zip file
	 */
	getZipDownload : function(path,res) {
		//get the zip file's name
		var downloadFile     = path.substr(path.lastIndexOf('/') + 1);
		var downloadFilePath = config.writePath + downloadFile;

		//figure out mimetype
		var mimetype = mime.lookup(downloadFilePath);
		
		//set headers to pipe out the file
		res.setHeader('Content-disposition', 'attachment; filename=' + downloadFile);
  		res.setHeader('Content-type', mimetype);

  		//create a file stream
  		var filestream = fs.createReadStream(downloadFilePath);

  		//pipe it into the response to force download
  		filestream.pipe(res);
	}

}