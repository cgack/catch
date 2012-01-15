/*init();
		var count = 0;
	

		function init() {
			if (window.DeviceOrientationEvent) {
				// Listen for the deviceorientation event and handle the raw data
				window.addEventListener('deviceorientation', function(eventData) {
					// gamma is the left-to-right tilt in degrees, where right is positive
					var tiltLR = eventData.gamma;
					
					// beta is the front-to-back tilt in degrees, where front is positive
					var tiltFB = eventData.beta;
					
					// alpha is the compass direction the device is facing in degrees
					var dir = eventData.alpha
					
					// deviceorientation does not provide this data
					var motUD = null;
					
					// call our orientation event handler
					deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
					}, false);
			} 
		}
          
		function deviceOrientationHandler(tiltLR, tiltFB, dir, motionUD) {
                        coor.x = coor.x + tiltLR;
                        coor.y = coor.y + tiltFB;
                        draw["move"](coor);                 
		}
*/          
          /*var cvs = document.getElementById("cvs"),
              ctx = cvs.getContext("2d"),
              img,
              img2;
            */  
          /*  
          
          var resizeCvs = function() {
            var w = $(window).width(),
                h = $(window).height();
            ctx.canvas.width = w;
            ctx.canvas.height =  h;
           };
        */
          
         
         
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
      currentScore = 10000;
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
      /*
       var initializeCvs = function () {
            ctx.lineCap = "round";
            ctx.save();
            resizeCvs();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();            
          };
        */    
      
  /*orientation stuffs*/
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
  
  var orientationYo = function(ltr, ftb) {
    coor.x = coor.x + ltr;
    coor.y = coor.y + ftb;
    draw.move(coor);   
  };
  var prevCoor = { x: 0, y: 0 };
  var draw = {
    isDrawing: false,
    collided: false,
    start: function(coordinates) {
      this.drawIt(coordinates);
//        ctx.moveTo(coordinates.x, coordinates.y);
  //      prevCoor.x  = coordinates.x;
    //    prevCoor.y = coordinates.y;
        this.isDrawing = true;
    },
    drawIt: function (coordinates) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "rgb(150,150,150)";
        //ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(coordinates.x, coordinates.y, 25, 0, Math.PI * 2, true);
        ctx.fill();
    },
    move: function(coordinates) {
        if (this.isDrawing) {
          
          //bounds
          this.checkBounds(coordinates);
         
         //this.checkCollision(coordinates);
          if (this.collided) {
            ctx.fillStyle = ctx.strokeStyle == "red" ? "rgb(150,150,150)" : "red" ;
          	alert('victory!!!');
          }
          /*
            ctx.lineTo(coordinates.x, coordinates.y);
            prevCoor.x  = coordinates.x;
            prevCoor.y = coordinates.y;
            ctx.stroke();*/
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
    },
    checkCollision: function(coordinates) {
      var imgData = ctx.getImageData(coordinates.x, coordinates.y, ctx.lineWidth, ctx.lineWidth );
      var pix = imgData.data;
      for (var i = 0, n = pix.length; i < n; i += 4) {
          //check if we're not on a white pixel
          if (pix[i] !== 0) {
              this.collided = true;
              
              break;
          } else {
              this.collided = false;

          }

      }
    }
  };
  var coor = { x: 200, y: 200 };
  draw.start(coor);

  var initLevel = function() {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
     drawShape();
  };

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
                      //draw Ball
        if (this.collided) {
          alert("victory! Your score: " + currentScore);
        }
          context.fillStyle = this.collided === true ? 'red' : '#bada55';
          context.beginPath();
          context.arc(this.position.x, this.position.y, r, 0, Math.PI * 2, true);
          context.fill();
      },
      move: function() {
		  currentScore = currentScore - 15;
          this.velocity = this.velocity.add(g);
          initLevel();

          this.checkBoundaryCollisions();
          this.checkObjectCollisions();

          this.position.x += this.velocity.x1;
          this.position.y += this.velocity.x2;
          this.draw();

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
          var imgData = context.getImageData(this.position.x + this.velocity.x1, this.position.y + this.velocity.x2, r, r);
          var pix = imgData.data;
          for (var i = 0, n = pix.length; i < n; i += 4) {
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
          imgData = ctx.getImageData(this.position.x + this.velocity.x1, this.position.y + this.velocity.x2, r, r);
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

  var drawShape = function() {
    /* no shape for now   
    context.fillStyle = "rgb(150,150,150)";
      context.beginPath();
      context.moveTo(200, 100);
      context.lineTo(300, 125);
      context.lineTo(250, 175);
      context.lineTo(200, 200);
      context.lineTo(200, 100);
      context.fill();
      context.closePath();
    */
      
  };

  var balls = [];
  balls.push(new Ball());
// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      console.log('raf');
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 10);
              };
    })();
  var bounce = function() {
    requestAnimFrame( bounce );
    balls[0].move();
  };
  /*var bouncing = null;
  bouncing = setInterval(function() {
      balls.forEach(function(ball) {
          ball.move();
      });
  }, 25);
  */
  initLevel();
  
  window.onresize = function() {
    resizeCvs();
  };
  
  var initCvs = function() {
    resizeCvs();        
    bounce();
  };
 
  initCvs();
  /*
  var start;
  $("#canvas").mousedown(function(event) {
      start = new Point(event.pageX - $("#canvas").offset().left, event.pageY);
  }).mouseup(function(event) {
      var end = new Point(event.pageX - $("#canvas").offset().left, event.pageY);
      var ball = new Ball();
      ball.position = end;
      ball.velocity = start.relative(end).scale(0.2);
      ball.move();
      balls.push(ball);
  });
*/

});