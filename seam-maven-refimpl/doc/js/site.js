/* 
 * File        : site.js
 * Version     : 
 * Author      : leif.olsen@knowit.no
 * Copyright   : LGPL
 * Description : 
 * Notes       :
 * Dependencies: jquery.js
 * Created     : 20100305
 * History     : 
 *               
 */
function getElement( element ) {
  return element ? (typeof element === "string" ? document.getElementById( element ) : element) : null;
}

function toggleElement( target ) {
  target = getElement( target );
  if( target ) {
    target.style.display = target.style.display.match(/none/i) ? 'block' : 'none';
  }
  return target;
}

/**
 * iframe singleton helper
 */
var IframeHelper = ( function() {

  // Private attributes and methods
  delta = (document.all && !window.opera) ? 6 : 0; // Correct some pixelstuff in m$ie 6/7/8

  toEms = function( px ) {
    return (px / 10) + 'em';
  }

  getIframeDocumentHeight = function( iframe ) {
    if( iframe ) {
      /* Fails in Chrome when executed in a local file system (due to security reasons), 
       * see: http://www.chromeplugins.org/google/plugins-development/access-iframe-contentwindow-8832.html
       * Works in ie8, ff3.6, Opera10.53, Safari4, Chrome
       */
      var d = (iframe.contentWindow || iframe.contentDocument);
      if (d.document) d = d.document;
      return d.body.offsetHeight || d.body.scrollHeight;
    }
    return 0;
  };
  
  doToggle = function( iframe ) {
    var iframeHeight = (parseFloat(iframe.style.height) || 0) * 10,
        docHeight    = getIframeDocumentHeight( iframe );
        
    iframe.style.height = toEms( iframeHeight < docHeight ? docHeight + delta : 0 );
  }

return ({
  // Public attributes and methods
  toggle: function( target ) {
    $(target).parent( '.code-frame' ).children( 'iframe' ).each( function() {
      doToggle( this );
    });
  }
}); //~return

} ) (); //~anonymous function immediately invoked with ()