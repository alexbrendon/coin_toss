

var Peasant = function( options ){
	this.radius = random(20,40);

	this.pickupTime = random(35,70);
	this.pickupReset = this.pickupTime;
	this.speed = random(3, 7);
	this.moving = true;

	this.coin = 0;
	this.coinStackDistance = 20;
	this.last = false;
	this.safe = false;

	this.proximity = 4;
}

Peasant.prototype = {

	init: function( ctx ){

		// Create array of different colored sprite images
		this.peasantColors = [];
		for (var i = 1; i < 7; i++) {
			this.peasantColors.push( '_ui/img/peasant-' + i + '.png' );
		}


		var newPosition = this._getPosition();

		this.startX = newPosition.x;
		this.startY = newPosition.y;

		this.endX = this.myCoins[this.coin].x;
		this.endY = this.myCoins[this.coin].y;
		
		this._calculatePath();
		this.peasantSprite();

		this.centerPoint = (this.sprite.w / 2) * -1;
	},


	/**
	 * Create a new image and
	 * set sprite sheet values
	 */
	peasantSprite: function(){
		this.img = new Image();
		// this.img.src = "_ui/img/peasant-sprite-3.png";
		this.img.src = random( this.peasantColors );

		this.sprite = {
			w: 27,
			h: 27,
			posX: 0,
			posY: 0,
			frames: 15,
			scale: 2
		};
	},




	/**
	 * Generates a random pair of xy coordinates that are always outside of the canvas
	 * @return {object} - returns x and y number values
	 */
	_getPosition: function(){
		var position = {};
		var section = Math.floor( random(0,4) );
		// var section = 3;

			if( section === 0 ){
				position.x = random(winWidth);
				position.y = -100;
			}

			if( section === 1 ){
				position.x = winWidth + 100;
				position.y = random(winHeight);
			}

			if( section === 2 ){
				position.x = random(winWidth);
				position.y = winHeight + 100
			}

			if( section === 3 ){
				position.x = -100;
				position.y = random(winHeight);
			}

		return position;
	},



	/**
	 * Calculates the slope of the peasant's path
	 * Sets the direction of animation
	 */
	_calculatePath: function(){
		this.tx = this.endX - this.startX;
		this.ty = this.endY - this.startY;

		this.direction = this.tx > 0 ? 1 : -1;

		this.dist = Math.sqrt( this.tx * this.tx + this.ty * this.ty );
		this.angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
	},




	/**
	 * Draws a peasant to the canvas 
	 * @param  {object} ctx - the current canvas object
	 */
	draw: function( ctx ){
		ctx.save();

		ctx.translate(this.startX, this.startY);
		ctx.rotate( this.angle );
		ctx.drawImage(this.img, this.sprite.posX, this.sprite.posY, this.sprite.w, this.sprite.h, this.centerPoint, this.centerPoint, this.sprite.w * this.sprite.scale, this.sprite.h * this.sprite.scale);		
	
		ctx.restore();
	},


	_selectCoin: function(){
		// Set new destination using another available coin
		this.endX = this.myCoins[this.coin].x;
		this.endY = this.myCoins[this.coin].y;

		// Reset path and move to new coin
		this._calculatePath();
		this.moving = true;
		this.pickupTime = this.pickupReset;
	},


	_running: function(){

		var linearSpeed = 100;
		var newX = linearSpeed * 2 / 1000;

		// Peasant is moving towards target
		if( this.dist > this.proximity){

			this.velX = (this.tx / this.dist) * this.speed;
			this.velY = (this.ty / this.dist) * this.speed;

			// this.velX = (this.tx / this.dist);

			this.startX += this.velX;
			this.startY += this.velY;


			// Return a collection of all the coins that are collected
			var collectedCoins = _.filter(this.myCoins, function( coin ){
				return coin.collected
			});

			// Make each coin that is collected move along with the peasant
			_.each( collectedCoins, function( coin, i ){
				coin.x = self.startX;
				coin.y = self.startY + 25;
			});


			// Set sprite to running
			this.sprite.posY = 0;

			if( this.sprite.posX < (this.sprite.frames * this.sprite.w) - (this.sprite.scale * this.sprite.w) ){
				this.sprite.posX += this.sprite.w;
			} else {
				this.sprite.posX = 0;
			}

			this._calculatePath();


		// Peasant arrived at target				
		} else {
			this.moving = false;
		}
	},

	_pickingUp: function(){
		var self = this;

		// If the peasant is not safely home with their coins
		if(!this.last){

			// Peasant is picking up coin
			if(this.pickupTime > 0){
				this.pickupTime -= 1;

				// Change to picking up sprite
				this.sprite.posY = this.sprite.h;

				if( this.sprite.posX < (this.sprite.frames * this.sprite.w) - (this.sprite.scale * this.sprite.w) ){
					this.sprite.posX += this.sprite.w;
				} else {
					this.sprite.posX = 0;
				}


			} else {

				// Peasant has acquired coin and needs a new target

				// Mark coin as collected
				if(this.myCoins[this.coin]){
					this.myCoins[this.coin].collected = true;
				}
				
				// Get next coin
				this.coin += 1;

				// If there are still coins available for grabbing
				if(this.coin < this.myCoins.length){

					this._selectCoin();

				// No more coins, send the peasant to a new
				// destination outside of game area
				} else {
					var newCoords = this._getPosition();
					this.endX = newCoords.x;
					this.endY = newCoords.y;


					// Reset path and move offscreen
					this._calculatePath();
					this.moving = true;
					this.last = true;
				}
			}
		} else {
			this.safe = true;
			_.each(this.myCoins, function( coin ){
				coin.taken = true;
			});
		}
	},



	update: function(){
		// Peasant is moving
		if(this.moving){
			this._running();
		// Peasant has stopped moving
		} else {
			this._pickingUp();
		}
	}
};








