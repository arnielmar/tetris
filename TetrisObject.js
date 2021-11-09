// ===================
// TETRIS OBJECT STUFF
// ===================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object


function TetrisObject(descr) {
  // Common inherited setup logic from Entity
  this.setup(descr);
  this.rememberResets();
  // Default sprite, if not otherwise specified
  //this.sprite = this.sprite || g_sprites.TetrisObject;
  // Set normal drawing scale, and warp state off
  this._scale = 1;
};



TetrisObject.prototype = new Entity();



TetrisObject.prototype.rememberResets = function () {
  // Remember my reset positions
  this.reset_cx = this.cx;
  this.reset_cy = this.cy;
  this.reset_rotation = this.rotation;
};

TetrisObject.prototype.KEY_ROTATE = 'W'.charCodeAt(0);  // Snúa kalli
TetrisObject.prototype.KEY_DOWN = 'S'.charCodeAt(0);   // Niður með kall
TetrisObject.prototype.KEY_LEFT = 'A'.charCodeAt(0);  // Færa kall til vinstri
TetrisObject.prototype.KEY_RIGHT = 'D'.charCodeAt(0);  // Færa kall til hægri

TetrisObject.prototype.KEY_SWITCH = 'C'.charCodeAt(0);  // Geyma kall

TetrisObject.prototype.KEY_SWITCH = 'SPACE'.charCodeAt(0); //Ekki viss hvort þetta sé rétt fyrir space takkan, færa hlutinn neðst á gridinu

// Initial, inheritable, default values
TetrisObject.prototype.rotation = 0;
TetrisObject.prototype.cx = 4;   // Byrjar í miðjunni 
TetrisObject.prototype.cy = 0;                  // Efst uppi
TetrisObject.prototype.velX = 0;                // TODO
TetrisObject.prototype.velY = 0;                // TODO
TetrisObject.prototype.launchVel = 2;
TetrisObject.prototype.numSubSteps = 1;

//Breytur fyrir tetramino
TetrisObject.prototype.tetromino;
TetrisObject.prototype.tetrominoN = 0;
TetrisObject.prototype.currentTetromino;

//next tetramino
TetrisObject.prototype.nextTetromino;
TetrisObject.prototype.currNextTetromino;
//TetrisObject.prototype.currentTetramino;

//"Gravity"
TetrisObject.prototype.dropRate= 1000 / NOMINAL_UPDATE_INTERVAL;



//this.currentTetromino = this.tetromino[this.tetrominoN%this.tetromino.length]
//lélegur góði bara til að sjá virkni
//Hugsa að það sé best að setja upp aðra js skrá sem heldur utan um alla tetrominos og svo þegar það er búið til tetrishlut þá kallar hann á það fylki,
//Allir tetris hlutir eru svo með 4 önnur fylki sem eru mögulegu hreyfingarnar sem þeir geta tekið.


TetrisObject.prototype.update = function (du) {

  // TODO - Á kannski heima annarsstaðar
  if (eatKey(this.KEY_LEFT)) {
      //Þetta er þá hliðar collision 
      //Betra að hafa þessi collisions í falli og merkja sem this.isColliding()
      //Fallið þarf að taka inn hvaða shape er verið að checka á
      if(this.cx-1>-1){
        this.reset();
        this.cx-=1;
        console.log("þetta má!")
      }else{
        console.log("neibb");
      }
  }

  if (eatKey(this.KEY_RIGHT)) {
    if(this.cx+1<9){
      this.reset();
      this.cx+=1;
      console.log("Þetta má!");
    }else{
      console.log("neibb");
    }
  }

  if(eatKey(this.KEY_DOWN)){
    
    if(this.cy+1<19){
      this.reset();
      this.cy+=1;
      console.log(this.cy);
    }
  }

  if(eatKey(this.KEY_ROTATE)){
    console.log(this.currNextTetromino);
    this.reset();
    this.tetrominoN++;
    this.currentTetromino = this.tetromino[this.tetrominoN%this.tetromino.length]
    //test til að sjá hvort þetta virkar
    
  }



  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }

  // Perform movement substeps
  var steps = this.numSubSteps;
  var dStep = du / steps;
  for (var i = 0; i < steps; ++i) {
    this.computeSubStep(dStep);
  }

  if (this.isColliding()) {
    // TODO - this.stop()????
  } else {
    spatialManager.register(this);
  }

  this.dropRate -= du;
  if(this.dropRate<0){
    this.reset();
    this.cy+=1;
    this.dropRate = 1000 / NOMINAL_UPDATE_INTERVAL;
    
  }

};

TetrisObject.prototype.computeSubStep = function (du) {

  // TODO - Þurfum við þetta?
};


TetrisObject.prototype.applyAccel = function (accelX, accelY, du) {

  // u = original velocity
  var oldVelX = this.velX;
  var oldVelY = this.velY;

  // v = u + at
  this.velX += accelX * du;
  this.velY += accelY * du;

  // v_ave = (u + v) / 2
  var aveVelX = (oldVelX + this.velX) / 2;
  var aveVelY = (oldVelY + this.velY) / 2;

  // Decide whether to use the average or not (average is best!)
  var intervalVelX = g_useAveVel ? aveVelX : this.velX;
  var intervalVelY = g_useAveVel ? aveVelY : this.velY;

  // s = s + v_ave * t
  var nextX = this.cx + intervalVelX * du;
  var nextY = this.cy + intervalVelY * du;

  // s = s + v_ave * t
  this.cx += du * intervalVelX;
  this.cy += du * intervalVelY;
};

/*
TetrisObject.prototype.getRadius = function () {
  return (this.sprite.width / 2) * 0.9;
};
*/
TetrisObject.prototype.reset = function (){
  for(let r = 0; r<this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    cells[x][y] = {status: 0}
  } 
}

TetrisObject.prototype.render = function (ctx) {

  //Sprite hlutir sem við pælum seinna í
  //var origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
  //this.sprite.scale = this._scale;
  //this.sprite.drawWrappedCentredAt(
   // ctx, this.cx, this.cy, this.rotation
  //);
  //this.sprite.scale = origScale;
  
  for(let r = 0; r<this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    cells[x][y] = {status: 1}
  } 

  //smá test
  //bæta alltaf við 27
  
  /*
  var number = 27;
  for(let i = 0; i<this.currNextTetromino.length; i++){

    //þetta virkar allavega
    let x = this.currNextTetromino[i][0];
    let y = this.currNextTetromino[i][1];
    ctx.beginPath();
    ctx.rect(x+number+400,y+number+20,27,27);
    ctx.fillStyle = 'red';
    ctx.fill();
    number+=27; 
  }
  */
  
 //Það þarf að staðsetja þetta í öðru hliðar griddi
 //til þess að ég get rendarað næsta hlut
};
