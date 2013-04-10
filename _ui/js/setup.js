
	
	var random  = function( min, max ) {

	    if ( min && typeof min.length === 'number' && !!min.length )
	        return min[ Math.floor( Math.random() * min.length ) ];

	    if ( typeof max !== 'number' )
	        max = min || 1, min = 0;

	    return min + Math.random() * (max - min);
	}

	var COLORS = [ '#F1D258','#CAA100','#FCFBCA' ];


	var winWidth  = window.innerWidth;
	var winHeight = window.innerHeight;


