



$(function(){
	
	var count = 0,
		coinID = 0,
		peasantSlots = 10,
		coinsInHand = 15;





	var game = $('#canvas');

	$('#canvas').attr({width: winWidth, height: winHeight});
	var elCanvas = document.getElementById('canvas');
	var ctx      = elCanvas.getContext('2d');
	

	var coins = [];
	var peasants = [];
	
	function mintCoin( event ) {
		if( event ){
			if( event.fingers > 3){
				if(count % 3 === 1){
					if( coinsInHand > 0){
						var coin = new Coin();
						coin.x = event.pageX;
						coin.y = winHeight - event.pageY;
						coin.z = event.pageZ;

						coin.init();
						coins.push(coin);

						coinsInHand--;
					}
				}
				count++;
			} else {
				coinsInHand = 15;
			}
		}
	}



	function lurePeasant( event ){

		// Return only coins that haven't been called dibs on
		var availableCoins = _.filter(coins, function( coin ){
			return !coin.calledFor;
		});

		var peasant = new Peasant();
		peasant.myCoins = [];
		
		for (var i = 0; i < peasantSlots; i++) {
			peasant.myCoins[i] = availableCoins[i];
			peasant.myCoins[i].calledFor = true;	
		};


		peasant.init( ctx );
		peasants.push(peasant);
	}



	function droppedCoin() {
		var droppedCoins = _.filter(coins, function( coin ){
			return coin.canCollect;
		});

		if(droppedCoins.length % peasantSlots === 0){
			lurePeasant();
		}
	}


	function clearCanvas(){
		ctx.clearRect(0, 0, winWidth, winHeight);
	}

	function reset(){
		coins = [];
		peasants = [];
	}



	draw();

	function draw() {
		clearCanvas();


		var availableCoins = _.filter( coins, function( coin ){
			return !coin.taken;
		});

		_.each( availableCoins, function( coin ){
			coin.update();
			coin.draw( ctx );
		});


		var greedyPeasants = _.filter( peasants, function( peasant ){
			return !peasant.safe;
		});

		_.each( greedyPeasants, function( peasant ){
			peasant.update();
			peasant.draw( ctx );
		});


		requestAnimationFrame(draw);
	}	


	var $body = $('body');


	$body.on('click', function( event ){
		mintCoin( event );
	});


	$body.on('onCoinDrop', function(){
		droppedCoin();
	});

	$body.on('safe', function( event, peasant ){
		removePeasant( peasant.id );
	});


	$('#clear').on('click', function( event ){
		event.preventDefault();
		reset();
	});


	Leap.loop(function( frame ){
		var fingerData = getFingerData( frame );

		if(fingerData){
			mintCoin( fingerData );
		}
	});


});








