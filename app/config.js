/**
 * MailNaut Config
 *
 * @module      :: Controller
 * @description	:: Some config options
 *
 */

var path       = require('path');
var mkdirp     = require('mkdirp');

// expose the config to our app with module.exports
module.exports = {
	//the path to write files too
	writePath : path.join(__dirname + '/output/'),

	/**
	 * makeWritePath 
	 * function utilizing the mkdirp library to make sure the writePath exists and is writeable
	 * 
	 * @return {Void}
	 */
	makeWritePath : function () {
		//make the writePath work
		mkdirp(this.writePath, function(err) { 
		    if(err){
		    	console.log('Could not write to path: '+this.writePath);
		    }
		});
	}
}