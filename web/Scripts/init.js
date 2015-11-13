/**
 * @class MyApp
 */

/**
 * @constructor
 */
var MyApp = window.MyApp = function () {
   
}

MyApp.prototype = {
   
   constructor : MyApp,
   
   /**
    * @method init
    * @public
    * 
    * Inits our app. Retrieves the model and applies bidirectional bindings
    */
   init        : function () {
      this.getModel( this.applyBindings.bind( this ) );
   },
   
   /**
    * @method getModel
    * @public
    * 
    * Retrieves model from the server. Calls the passed callback with the model
    *  
    * @param  {Function} callback function to be executed when the model is fetched
    */
   getModel     : function ( callback ) {
      var xhr = new XMLHttpRequest();
      xhr.open( 'GET', location.protocol + '//' + location.host + '/data' );
      xhr.onload = function () {
         callback( JSON.parse( this.responseText ) );
      }
      xhr.send();
   },
   
   /**
    * @method applyBindings
    * @private
    * 
    * Applies KnockoutJS bindings using the passed object as a model
    * 
    * @param  {Object} model The model to be applied
    */
   applyBindings : function ( model ) {
      ko.applyBindings( this.makeObservable( model ), document.body );
      if ( typeof render == 'function' ) {
         // This is executed on the server - set the `value` attributes...
         this.setValues();
         // This is executed on the server - call the `render` page function.
         render();
      }
   },
   
   /**
    * @method makeObservable
    * @private
    * 
    * Creates a new model with observable properties from the passed static model
    * 
    * @param  {Object} model The model whose properties to be converted to observables
    * 
    * @return {Object}       New model with observable properties
    */
   makeObservable : function ( model ) {
      var observable = {};
      for ( var name in model ) {
         if ( model.hasOwnProperty( name ) ) {
            observable[ name ] = ko.observable( model[ name ] );
         }
      }
      return observable;
   },
   
   /**
    * @method  setValues
    * @private
    * 
    * Loops through form elements. If they have a `value` property being set,
    * it is also set as HTML value in order to appear on the rendered page.
    */
   setValues : function () {
      var elems = document.querySelectorAll( 'input, textarea, select' );
      for ( var i=0, l=elems.length; i<l; i++ ) {
         var elem = elems[i];
         if ( typeof elem.value != 'undefined' ) {
            switch ( elem.tagName ) {
            case 'INPUT':
               switch ( elem.type.toLowerCase() ) {
               case 'checkbox':
               case 'radio':
                  if ( elem.checked ) {
                     elem.setAttribute( 'checked', 'checked' );
                  } else {
                     elem.removeAttribute( 'checked' );
                  }
                  break;
               default:
                  elem.setAttribute( 'value', elem.value );
               }
               break;
            case 'SELECT':
               // Go through all <option> elements & mark the one that
               // has the selected value as "selected"
               for ( var i=0, l=elem.options.length; i<l; i++ ) {
                  if ( elem.selectedIndex == i ) {
                     elem.options[i].setAttribute( 'selected', 'selected' );
                  } else {
                     elem.options[i].removeAttribute( 'selected' );
                  }
               }
               break;
            case 'TEXTAREA':
               elem.innerHTML = elem.value;
               break;
            }
         }
      };
   }
   
};
