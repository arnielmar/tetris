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


  /////////////////////////////////////////////////////////////////////////////////////////////
  // EDGE COLLISIONS
  /////////////////////////////////////////////////////////////////////////////////////////////

  // Held það sé í lagi að hafa þetta hérna, isColliding er þá bara fyrir hlut í hlut collision

  if (eatKey(this.KEY_LEFT)) {
    this.oneLeft();
  }

  if (eatKey(this.KEY_RIGHT)) {
    this.oneRight();
  }

  if(eatKey(this.KEY_DOWN)){
      //this.reset();
      //this.oneDown();
      //g_grid.resetGrid();
      this.reset();
      this.oneDown();
  }
  /////////////////////////////////////////////////////////////////////////////////////////////
  // EDGE COLLISIONS
  /////////////////////////////////////////////////////////////////////////////////////////////

  if(eatKey(this.KEY_ROTATE)){
    this.rotate();
    this.calcWidthNHeight();

    //let nextPatter = this.tetromino[(this.tetrominoN+1)%this.tetromino.length]
  

    // þarf að passa að það brotni ekkert þegar kubbur snýst.

  }

  for(let r = 0; r<this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = {
      status: 1,
      sprite: this.currentTetroSprite
    }
  }



  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }

  
  // make sure it dosent collide with itself
  // this.reset();

  if (this.isColliding()) {
    console.log("collision");
    console.log("er ég hérna");
    // TODO - this.stop()????

    //byrja að gera þetta fall sem merkir sem 2
  } else {
    spatialManager.register(this);
  }

  //Vantar enþá collision þegar það er ýtt niður
  this.dropRate -= du;
  if(this.dropRate<0 && this.cy + this._height < g_grid.gridRows+1){
    this.reset();
    this.dropRate = 1000 / NOMINAL_UPDATE_INTERVAL;
    this.oneDown();
    //this.cy++;
    
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




TetrisObject.prototype.oneDown = function () {
  if((this.cy + this._height < g_grid.gridRows)){
      //if(!this.objectCollisionDown()){
      if(!this.objectCollisionDown()){
        this.reset();
        this.cy+=1;
      }else{
        this.spawnNew();
      }  
  }else{
    console.log("collision")
    
    this.spawnNew();
    
  }
}

TetrisObject.prototype.spawnNew = function (){
  this.kill();
  createTetro();
}

TetrisObject.prototype.oneRight = function () {
  if((this.cx + this._width) < g_grid.gridColumns){
      if(!this.objectCollisionRight()){
        this.reset();
        this.cx+=1;
      }
  }
}


TetrisObject.prototype.oneLeft = function () {
  if(this.cx > 0){
    if(!this.objectCollisionLeft()){

      this.reset();
      this.cx-=1;
    }
    
  }
}


TetrisObject.prototype.objectCollisionDown= function (){
  //Þessi kóði virkar 
  let tetrominoCopy = this.currentTetromino;
  for(let i =0; i<tetrominoCopy.length;i++){
    let square = tetrominoCopy[i];
    let x = square[0]+this.cx;
    let y = square[1]+this.cy;
    if(g_grid.cells[x][y+1].status===1){
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.objectCollisionRight = function (){
  //Þetta er gallað
  var biggerX = 0;
  let x;
  let y;
  for(let r = 0; r < this.currentTetromino.length; r++){
    x = this.currentTetromino[r][0] + this.cx;
    y = this.currentTetromino[r][1] + this.cy;
    if(x>biggerX){
      biggerX = x;
    }
  }
 if((g_grid.cells[biggerX+1][this.cy+this._height].status===1) || (g_grid.cells[biggerX+1][this.cy].status===1)){
   return true;
 }else{
   return false;
 }
}









TetrisObject.prototype.objectCollisionLeft = function (){
  //Þetta er gallað
  if((g_grid.cells[this.cx-1][this.cy+this._height].status===1) || (g_grid.cells[this.cx-1][this.cy].status===1)){
    return true;
  }else{
    return false;
  }

    
}


TetrisObject.prototype.rotate = function(){
  
  //frekar að athuga með next pattern
    if(this.cx + this._width<g_grid.gridColumns){
      if((this._height === 0 || this._height === 3) && (this.cx <=11 && this.cx> 6)){
        this.reset();
        this.cx = 6;
      }
      this.reset();
      this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
      this.currentTetromino = this.tetromino[this.tetrominoN];
      
    }
    if(this.cx + this._width>=g_grid.gridColumns){
      //Þetta virkar fyrir alla kubbana nema I
      //Bara eitt tilvik þar sem þetta virkar ekki, þegar I kubburinn er alveg útí enda láréttur
      //ætla að skoða þetta betur seinni
      if((this._height !== 0 || this._height !== 3)){
        
        this.reset();
        this.cx = 8;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
        this.currentTetromino = this.tetromino[this.tetrominoN];
      } 
    }

}

TetrisObject.prototype.testCollision = function(){
  for(var r = 0; r<this.currentTetromino.length; r++){

      let newX = this.currentTetromino[r][0] + this.cx;
      let newY = this.currentTetromino[r][1] + this.cy;

      if(newX < 0 || newX >= g_grid.gridColumns || newY >= g_grid.gridRows){
        return true;
      }

      if(newY < 0){
        continue;
      }

      if(g_grid.cells[newX][newY].status === 1){
        return true;
      }
  }
  return false;
}


TetrisObject.prototype.reset = function (){
  for(let r = 0; r < this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = {status: 0}
  }
}

TetrisObject.prototype.killTetromino = function (){
  for(let r = 0; r < this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = {status: 2}
  }
}

TetrisObject.prototype.render = function (ctx) {
  
  for(let r = 0; r<this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = {
      status: 1,
      sprite: this.currentTetroSprite
    }
  }

};
