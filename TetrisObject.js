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

  // calc width and height from tetremino
  this.calcWidthNHeight();

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
TetrisObject.prototype._width = 0;
TetrisObject.prototype._height = 0;

//TetrisObject.prototype.currentTetramino;


//lélegur góði bara til að sjá virkni
//Hugsa að það sé best að setja upp aðra js skrá sem heldur utan um alla tetrominos og svo þegar það er búið til tetrishlut þá kallar hann á það fylki,
//Allir tetris hlutir eru svo með 4 önnur fylki sem eru mögulegu hreyfingarnar sem þeir geta tekið.


TetrisObject.prototype.update = function (du) {

  const currPosX = this.cx;
  const currPosY = this.cy;

  /////////////////////////////////////////////////////////////////////////////////////////////
  // EDGE COLLISIONS
  /////////////////////////////////////////////////////////////////////////////////////////////

  // Held það sé í lagi að hafa þetta hérna, isColliding er þá bara fyrir hlut í hlut collision

  if (eatKey(this.KEY_LEFT)) {
    if(this.cx > 0){
      g_grid.resetGrid();
      this.cx-=1;
    }
  }

  if (eatKey(this.KEY_RIGHT)) {
    if((this.cx + this._width) < g_grid.gridColumns){
      g_grid.resetGrid();
      this.cx+=1;
    }
  }

  if(eatKey(this.KEY_DOWN)){

    if(this.cy + this._height < g_grid.gridRows){
      g_grid.resetGrid();
      this.cy += 1;
    } else {
      // get stuck and kill!
      console.log("collision")
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////
  // EDGE COLLISIONS
  /////////////////////////////////////////////////////////////////////////////////////////////

  if(eatKey(this.KEY_ROTATE)){

    g_grid.resetGrid();
    this.tetrominoN++;
    this.currentTetromino = this.tetromino[this.tetrominoN % this.tetromino.length]

    //test til að sjá hvort þetta virkar

    // reCalculate width and height
    this.calcWidthNHeight();

    // þarf að passa að það brotni ekkert þegar kubbur snýst.
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
    console.log("collision");
    // TODO - this.stop()????
  } else {
    spatialManager.register(this);
  }

};

TetrisObject.prototype.isColliding = function() {
  for(let r = 0; r<this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;

    let result = g_grid.isOccupied(x,y);
    if (result) return true;
  }
  return false;
}

TetrisObject.prototype.calcWidthNHeight = function() {
  var wLargestX = 0;
  var hLargestX = 0;


  // go through tetremino
  for (var i = 0; i < this.currentTetromino.length; i++) {
    var tetreminoBlock = this.currentTetromino[i];
    // width
    if (tetreminoBlock[0] > wLargestX) {
      wLargestX = tetreminoBlock[0];
    }
    // height
    if (tetreminoBlock[1] > hLargestX) {
      hLargestX = tetreminoBlock[1];
    }
  }

  this._width = wLargestX;
  this._height = hLargestX;

}

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
    g_grid.cells[x][y] = {status: 1}
  }

};
