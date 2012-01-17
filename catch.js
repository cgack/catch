/*Math Utlities*/

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype = {
    relative: function(to) {
        return new Vector(to.x - this.x, to.y - this.y);
    },
    distance: function(to) {
        return Math.sqrt(Math.pow(this.x - to.x, 2) + Math.pow(this.y - to.y, 2));
    }
};

function Vector(x1, x2) {
    this.x1 = x1;
    this.x2 = x2;
}
Vector.prototype = {
    add: function(other) {
        return new Vector(this.x1 + other.x1, this.x2 + other.x2);
    },
    scale: function(by) {
        return new Vector(this.x1 * by, this.x2 * by);
    },
    normalize: function() {
        function norm(value) {
            return value > 0 ? 1 : value < 0 ? -1 : 0;
        }
        return new Vector(norm(this.x1), norm(this.x2));
    }
};

$(function() {
	var canvasWidth,
      	canvasHeight,
		r = 20,
		canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d'),
		cvs = document.getElementById('cvs'),
		ctx = cvs.getContext('2d'),
		g = new Vector(0, 0.981),
		drag = 1.2,
		bound = {
			x1: 0,
			y1: 0
		},
		gameState = { 
			currentScore: 10000,
			victory: false,
			playing: false
		};
     
  /*orientation stuffs*/
  	var initOrientation = function() {
		var count = 0, gam = 0, bet = 0;
		if (window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", function(e) {
				//gamma = left to right
				//beta = front back
				//alpha = compass dir
				count = count + 1;
				gam += e.gamma;
				bet += e.beta;
				 
				if (count === 0 || count % 10 === 0) {
					orientationYo(gam, bet);
					gam = 0;
					bet = 0;
				}
			}, false);
		} 
		//or use keys to move:
		$(document).keyup(function (e) {
			// H - 72 - left
			// L - 76 - right
			// J - 74 - up
			// K - 75 - dwn
			switch (e.which) {
				case 72: /*H - Left*/
					coor.x = coor.x - 10;
					break;
				case 76: /*L - Right*/
					coor.x = coor.x + 10;
					break;
				case 74: /*J - dwn*/
					coor.y = coor.y + 10;
					break;
				case 75: /*K - up*/
					coor.y = coor.y - 10;
					break;
			}
			if (!gameState.victory && gameState.playing) {
				tgt.move(coor);
			}
		});
		
	};
	
	var orientationYo = function(ltr, ftb) {
		coor.x = coor.x + ltr;
		coor.y = coor.y + ftb;
		if (!gameState.victory && gameState.playing) {
			tgt.move(coor);   
		}
	};
  
	var tgt = {
		isDrawing: false,
		collided: false,
		start: function(coordinates) {
		  	this.drawIt(coordinates);
			this.isDrawing = true;
		},
		drawIt: function (coordinates) {
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			ctx.fillStyle = "rgb(150,150,150)";
			ctx.beginPath();
			ctx.arc(coordinates.x, coordinates.y, 25, 0, Math.PI * 2, true);
			ctx.fill();
		},
		move: function(coordinates) {
			if (this.isDrawing) {
			  this.checkBounds(coordinates);
			  this.drawIt(coordinates);
			}
		},
		finish: function(coordinates) {
			this.isDrawing = false;
			ctx.lineTo(coordinates.x, coordinates.y);
			ctx.stroke();
			ctx.closePath();                
		},
		checkBounds: function(coordinates) {
			 if (coordinates.y > bound.y2) {
				coordinates.y = bound.y2;
			  } else if (coordinates.y < bound.y1) {
				coordinates.y = bound.y1;
			  } else if (coordinates.x > bound.x2) {
				coordinates.x = bound.x2;
			  } else if (coordinates.x < bound.x1) {
				coordinates.x = bound.x1;
			  }
		}
  	};
  	var coor = { x: 300, y: 150 };
  	var Ball = function() {
		  this.position = new Point(200, 200);
		  this.velocity = new Vector(-5, 5);
		  drag = 1;
	  };

	Ball.prototype = {
		collided: false,
      	remove: function() {
        	this.output.remove();
      	},
      	draw: function() {
        	if (this.collided) {
  				victory();
        	}
			context.fillStyle = this.collided === true ? 'red' : '#bada55';
			context.beginPath();
			context.arc(this.position.x, this.position.y, r, 0, Math.PI * 2, true);
			context.fill();
      	},
      	move: function() {
    		if (!gameState.victory && gameState.playing) {
			  	gameState.currentScore = gameState.currentScore - 15;
			  	this.velocity = this.velocity.add(g);
			  	initLevel();
	
			  	this.checkBoundaryCollisions();
			  	this.checkObjectCollisions();
	
			  	this.position.x += this.velocity.x1;
			  	this.position.y += this.velocity.x2;
				this.draw();
			}
		},
		checkBoundaryCollisions: function() {
			if (this.position.y > bound.y2) {
			  this.velocity.x2 = -this.velocity.x2 * drag;
			  this.position.y = bound.y2;
			} else if (this.position.y < bound.y1) {
			  this.velocity.x2 = -this.velocity.x2 * drag;
			  this.position.y = bound.y1;
			}
			if (this.position.x < bound.x1) {
			  this.velocity.x1 = -this.velocity.x1 * drag;
			  this.position.x = bound.x1;
			} else {
			  if (this.position.x > bound.x2) {
				  this.velocity.x1 = -this.velocity.x1 * drag;
				  this.position.x = bound.x2;
			  }
			}

      	},
		checkObjectCollisions: function() {            
			var imgData = ctx.getImageData(this.position.x + this.velocity.x1, this.position.y + this.velocity.x2, r, r),
				pix = imgData.data;
			for (i = 0, n = pix.length; i < n; i += 4) {
				//check if we're not on a white pixel                
				if (pix[i] !== 0) {
					this.collided = true;
					if (Math.abs(this.velocity.x1) > Math.abs(this.velocity.x2)){
						this.velocity.x1 = -this.velocity.x1 * drag;
					} else {
						this.velocity.x2 = -this.velocity.x2 * drag;
					}
					break;
				} else {
					this.collided = false;
				}
			}
		}
	};


	var balls = [];
	balls.push(new Ball());
	
	// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 30);
              };
    })();
	var bounce = function() {
		requestAnimFrame( bounce );
		balls[0].move();
	};
  
  
	var initLevel = function() {
	  context.clearRect(0, 0, canvasWidth, canvasHeight);
	};

	initLevel();
	
	var resizeCvs = function() {
		canvasWidth = $(window).width();
		canvasHeight = $(window).height();
		bound.x2 = canvasWidth;
		bound.y2 = canvasHeight;
		context.canvas.width = canvasWidth;
		context.canvas.height = canvasHeight;
		ctx.canvas.width = canvasWidth;
		ctx.canvas.height = canvasHeight;
	};   
   
	var initCvs = function() {
		resizeCvs();        
		//bounce();
		ctx.font = "3em Helvetica";
		ctx.fillText("try to catch the ball", 200,200);
		ctx.fillText("as quickly as possible", 200,250);
		ctx.fillText("Tap or Click to begin", 200, 350);
	};
 
	initCvs();

	var victory = function() {
		ctx.font = "3em Lucida Console";
		ctx.fillText("victory! Your score: " + gameState.currentScore, 200,200);
		ctx.fillText("Tap or Click to continue", 200, 300);
		gameState.currentScore = 10000;
		gameState.victory = true;
	};


	$(document).on('click', function() {
		//Reset Game
  		if (gameState.victory) {
  			gameState.victory = false;
  			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  		}
  		//get the party started
  		if (!gameState.playing) {
  			gameState.playing = true;
  			resizeCvs();
  			initOrientation();
  			bounce();
  			tgt.start(coor);
			window.onresize = function() {
				resizeCvs();
			};
		  
  		}
  	});

});