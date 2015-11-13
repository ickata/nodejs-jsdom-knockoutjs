var express = require( 'express' );
var server  = express();
var fs      = require( 'fs' );
var jsdom   = require( 'jsdom' );

// Serve static files
[
   'css',
   'Images',
   'Scripts'
].forEach( function ( dir ) {
   this.use( '/' + dir, express.static( './web/' + dir ) );
}, server );

// Getting data
server.get( '/data', function ( request, response ) {
   response.end( fs.readFileSync( './data.json' ) );
});

// Process *.html files
server.use( '/', function ( request, response, next ) {
   jsdom.env({
      file : request.url == '/' ? './web/index.html' : './web' + request.url,
      done : function ( error, window ) {
         // Return response
         response.end( error ? '' : jsdom.serializeDocument( window.document ) );
      }
   });
});

// Start the server
server.listen( 3000 );
