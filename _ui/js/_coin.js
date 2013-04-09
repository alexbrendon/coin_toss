var Coin = function( options ){
	
	this.canCollect = false;

	this.radius = 90;
	this.startRadius = this.radius;
	this.theta  = random(Math.PI * 2);
	this.wander = 1;
	this.settle = 15;
	this.lineWidth = 3;


	this.gold = [];
	this.colors = [];

	this.color  = '#fff;'
	this.gold.push( { h:48, s:85, l:65 } );
	this.gold.push( { h:48, s:100, l:40 } );

	
}

Coin.prototype = {

	init: function(){
		this.radius = this.z + 50 || 90;
	},

	draw: function( ctx ){
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		
		ctx.fillStyle = this.color;
		ctx.fill();

		ctx.strokeStyle = '#CAA100';
		ctx.lineWidth = this.lineWidth;
		ctx.stroke();

		ctx.closePath();
	},

	update: function(){
		this.theta += random(-0.5, 0.5);
		
		var sin = Math.sin( this.theta ) * this.wander;
		var cos = Math.cos( this.theta ) * this.wander;

		// Coin falls from the balcony
		if( this.radius > this.startRadius / 20 ){
			this.radius *= 0.96;
			this.color = random( this.colors );

			this.vx = sin;
			this.vy = cos;

			this.x += this.vx;
			this.y += this.vy;

			this.lineWidth -= 0.03;

			this._updateColor();

		// Coin has landed on the ground	
		} else {

			// Coin still needs to settle on the ground
			if(this.settle > 0){
				this.x += random(-0.5,0.5);
				this.y += random(-0.5,0.5);;
				this.settle -= 0.4;

			// Coin has finished settling and can now be collected
			} else if(!this.canCollect) {
				this.canCollect = true;
				$('#canvas').trigger('onCoinDrop');
			}
		}
	},

	_updateColor: function(){
		for( var i = 0; i < this.gold.length; i++){
			var color = this._hslColor( this.gold[i].h, this.gold[i].s, this.gold[i].l );
			this.colors.push( color );


			this.gold[i].h -= 0.3;
			this.gold[i].s -= 0.5;
			this.gold[i].l -= 0.2;
		}
	},

	_hslColor: function( h, s, l ){
		return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	}

};