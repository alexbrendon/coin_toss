
	
	var random  = function( min, max ) {

	    if ( min && typeof min.length === 'number' && !!min.length )
	        return min[ Math.floor( Math.random() * min.length ) ];

	    if ( typeof max !== 'number' )
	        max = min || 1, min = 0;

	    return min + Math.random() * (max - min);
	}

	var leapXBounds = {min:-200,max:200};
	var leapYBounds = {min:50, max:400};
	var leapZBounds = {min:-120,max:120};

	var COLORS = [ '#F1D258','#CAA100','#FCFBCA' ];


	var winWidth  = window.innerWidth;
	var winHeight = window.innerHeight;


	var getFingerData = function(frame) {
		var fingerData = {};

		if( frame.hands.length > 0 ){

			for(i=0;i<frame.hands.length;i++){
				if( frame.hands[i].fingers.length > 0 ){

					for(k=0;k<frame.hands[i].fingers.length;k++){
						var finger = frame.hands[i].fingers[k];
							
						fingerData.pageX = _setPercent( finger.tipPosition[0], leapXBounds.min, leapXBounds.max, winWidth );
						fingerData.pageY = _setPercent( finger.tipPosition[1], leapYBounds.min, leapYBounds.max, winHeight );
						fingerData.pageZ = _setPercent( finger.tipPosition[2], leapZBounds.min, leapZBounds.max, 100 );
						fingerData.fingers = frame.hands[i].fingers.length;

						return fingerData;
					}
				}
			}
		}

	}


	var _setPercent = function ($curVal,$min,$max,ctx) {
		var totalVal = $max - $min;
		var curVal = $curVal - $min;
		var percentVal = curVal/totalVal;
		if(percentVal > 1) percentVal = 1;
		if(percentVal < 0) percentVal = 0;


		return (percentVal * ctx);
	}


