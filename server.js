// set up ======================================================================
  var express  = require('express');
  var app      = express();                     // create our app w/ express
  var port     = process.env.PORT || 8080;      // set the port
  var server = require('http').createServer(app);

  var jade = require('jade');

  

  app.configure(function() {
    app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
    app.use(express.logger('dev'));                     // log every request to the console
    app.use(express.bodyParser());                      // pull information from html in POST
    app.use(express.methodOverride());                  // simulate DELETE and PUT
    app.set('port', port);                              // set the port
    app.set('views','./app/views');                     // set the view directory
    app.set('view engine', 'jade');                     // using Jade template engine
  });

  // routes ======================================================================
  require('./app/routes.js')(app);

server.listen(app.get('port'), function () {
  console.log('Mailnaut has launched! View at http://localhost:' + app.get('port'));
});