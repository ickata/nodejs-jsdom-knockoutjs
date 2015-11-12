var express = require( 'express' );
var server  = express();
var fs      = require( 'fs' );

// Serve static files
[
   'css',
   'Images',
   'Scripts'
].forEach( function ( dir ) {
   this.use( '/' + dir, express.static( './web/' + dir ) );
}, server );

// Process *.html files
server.use( '/', function ( request, response, next ) {
   var filepath = request.url == '/' ? './web/index.html' : './web' + request.url;
   fs.readFile( filepath, function ( error, content ) {
      response.end( error ? '' : content );
   });
});

// Start the server
server.listen( 3000 );
