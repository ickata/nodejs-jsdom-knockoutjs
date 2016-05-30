var express = require( 'express' );
var server  = express();
var fs      = require( 'fs' );
var jsdom   = require( 'jsdom' );
var xhr     = require( 'xmlhttprequest' );
var vm      = require( 'vm' );

var PORT    = 3000;

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
      // A callback that will be executed for every external resource
      resourceLoader : function ( resource, callback_next ) {
         // `defaultFetch` is a reference to JSDOM's default fetching method.
         resource.defaultFetch( function ( error, script_content ) {
            // Append script content to the script element for later execution.
            resource.element.content = script_content;
            callback_next( error, '' );   // prevent JSDOM from executing our script
         });
      },
      done : function ( error, window ) {
         if ( error ) {
            return response.end( '' );
         }
         // Fix location properties
         window.location.protocol   = 'http:';
         window.location.host       = 'localhost:' + PORT;
         // Render page callback
         window.render = function () {
            // Return response
            response.end( jsdom.serializeDocument( window.document ) );
         }
         // Exec scripts in `vm` scope
         var context = vm.createContext( window );
         for ( var name in window ) {
            context[ name ] = window[ name ];
         }
         var scripts = window.document.getElementsByTagName( 'script' );
         for ( var i=0, l=scripts.length; i<l; i++ ) {
            var content = scripts[i].innerHTML || scripts[i].content;
            var runat   = scripts[i].getAttribute( 'runat' );
            
            switch ( runat ) {
            case 'server':
               // We need to be executed only on the server.
               // Remove the <script> element so it does not exec in client.
               scripts[i].parentNode.removeChild( scripts[i] );
            case 'both':
               // Remove [runat] attribute for HTML validation purposes
               scripts[i].removeAttribute( 'runat' );
               break;
            default:
               // All other cases - leave the <script> element and skip
               // execution on the server.
               continue;
            }
            
            vm.runInContext( content, context );
         }
      },
      features : {
         FetchExternalResources     : [ 'script' ],
         SkipExternalResources      : false
      }
   });
});

// Start the server
server.listen( PORT );
