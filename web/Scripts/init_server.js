( function () {

var MyApp = window.MyApp;
var applyBindings = MyApp.prototype.applyBindings;

/**
 * @method applyBindings
 * @private
 * 
 * Applies KnockoutJS bindings using the passed object as a model
 * 
 * @param  {Object} model The model to be applied
 */
MyApp.prototype.applyBindings = function ( model ) {
   applyBindings.apply( this, arguments );   // call the parent method
   this.setValues();
   render();
};

/**
 * @method  setValues
 * @private
 * 
 * Loops through form elements. If they have a `value` property being set,
 * it is also set as HTML value in order to appear on the rendered page.
 */
MyApp.prototype.setValues = function () {
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
};

})();
