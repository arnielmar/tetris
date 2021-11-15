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

TetrisObject.prototype.KEY_DROP = 'SPACE'.charCodeAt(0); //Ekki viss hvort þetta sé rétt fyrir space takkan, færa hlutinn neðst á gridinu

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

//My state, current = 0, next = 1, being held = 2
TetrisObject.prototype.myState = -1;

//TetrisObject.prototype.currentTetramino;

//"Gravity"
TetrisObject.prototype.dropRate = 1000 / NOMINAL_UPDATE_INTERVAL;



//this.currentTetromino = this.tetromino[this.tetrominoN%this.tetromino.length]
//lélegur góði bara til að sjá virkni
//Hugsa að það sé best að setja upp aðra js skrá sem heldur utan um alla tetrominos og svo þegar það er búið til tetrishlut þá kallar hann á það fylki,
//Allir tetris hlutir eru svo með 4 önnur fylki sem eru mögulegu hreyfingarnar sem þeir geta tekið.


TetrisObject.prototype.update = function (du) {

  // if im not the currently played tetromino then dont do anything
  if (this.myState === 1 && GET_NEXT_TETROMINO) {
    // clean
    this.myState = 0;
    GET_NEXT_TETROMINO = false;
    debugger;
  }

  if (this.myState === 2 && SWITH_HOLDING_TETREMINOS) {
    // clean
    this.myState = 0;
    SWITH_HOLDING_TETREMINOS = false;
    debugger;
  }

  if (this.myState !== 0) return;   // something wrong


  /////////////////////////////////////////////////////////////////////////////////////////////
  // EDGE COLLISIONS
  /////////////////////////////////////////////////////////////////////////////////////////////

  // Held það sé í lagi að hafa þetta hérna, isColliding er þá bara fyrir hlut í hlut collision

  if (eatKey(this.KEY_LEFT)) {
    this.reset();
    this.oneLeft();
  }

  if (eatKey(this.KEY_RIGHT)) {
    this.reset();
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

    if(!this.rotate() && !this.rotateCollision()){
      this.reset();
      this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
      this.currentTetromino = this.tetromino[this.tetrominoN];
    }
    if(this.rotate()){
      if(this._width==0 || this._width==3){
      this.reset();
      var nidur = -this._width-1-2;
      this.cx=this.cx+nidur;
      this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
      this.currentTetromino = this.tetromino[this.tetrominoN];
      }else{
        //harðkóðað fyrir I gæjann.....
      this.reset();
      var nidur = -this._width-1;
      this.cx=this.cx+nidur;
      this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length;
      this.currentTetromino = this.tetromino[this.tetrominoN];

      }
    }
    this.calcWidthNHeight();

    //let nextPatter = this.tetromino[(this.tetrominoN+1)%this.tetromino.length]


    // þarf að passa að það brotni ekkert þegar kubbur snýst.

  }

  if (eatKey(this.KEY_SWITCH)) {
    this.reset();
    this.myState = 2;
    SWITH_HOLDING_TETREMINOS = true;
    this.backToStart();
    return;
  }


  for(let r = 0; r<this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    if(g_grid.cells[x][y].status !==2){
      g_grid.cells[x][y] = {
        status: 1,
        sprite: this.currentTetroSprite
      }
    }
  }



  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }



  this.dropRate -= du;
  if(this.dropRate<0 && this.cy + this._height < g_grid.gridRows+1){
    this.reset();
    this.dropRate = g_grid.speed / NOMINAL_UPDATE_INTERVAL;
    this.oneDown();
  }
};

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
      if(!this.objectCollisionDown()){
        this.cy+=1;
      }else{
        this.spawnNew();
      }
  }else{

    this.spawnNew();

  }
}

TetrisObject.prototype.spawnNew = function (){
  // kill the current tertremino
  this.killTetromino();
  this.kill();
// debugger;
  // has the player lost
  // if any tetremino is stuck in the top most line, then "loss" else "still playing"

  if (this.cy === 0) {
    //player lost
    g_grid.lost = true;
  }


  // if player is still playing make new tertremino
  if (!g_grid.lost) {
    createTetro(1);
    GET_NEXT_TETROMINO = true;
  }
}

TetrisObject.prototype.oneRight = function () {
  if(((this.cx + this._width) < g_grid.gridColumns) && (!this.objectCollisionRight())){
      this.cx+=1;
  }
}

TetrisObject.prototype.oneLeft = function () {
  if(this.cx > 0 && !this.objectCollisionLeft()){
    this.reset();
    this.cx-=1;

  }
}

TetrisObject.prototype.objectCollisionDown= function (){
  //Þessi kóði virkar
  let tetrominoCopy = this.currentTetromino;
  for(let i =0; i<tetrominoCopy.length;i++){
    let square = tetrominoCopy[i];
    let x = square[0]+this.cx;
    let y = square[1]+this.cy;
    if(g_grid.cells[x][y+1].status===2){
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.objectCollisionRight = function(){

  for(var i = 0; i<this.currentTetromino.length; i++){
    var square = this.currentTetromino[i];
    var x = square[0]+this.cx;
    var y = square[1]+this.cy;
    x++;
    if(g_grid.cells[x][y].status === 2){
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.objectCollisionLeft = function (){
  for(var i = 0; i<this.currentTetromino.length; i++){
    var square = this.currentTetromino[i];
    var x = square[0]+this.cx;
    var y = square[1]+this.cy;
    x--;
    if(g_grid.cells[x][y].status ===2){
      return true;
    }
  }

  return false;

}

TetrisObject.prototype.rotate = function(){
  var tetromino = this.tetromino;
  var tetrominoCopy = this.currentTetromino;
  var tetrominoNCopy = this.tetrominoN;
  //Rotate-um þessum gervi hlut
  tetrominoNCopy = (tetrominoNCopy + 1)%tetromino.length;
  tetrominoCopy =  tetromino[tetrominoNCopy];

  for(var i = 0; i<tetrominoCopy.length; i++){
    var square = tetrominoCopy[i];
    var x = square[0]+this.cx;
    //var y = square[1]+this.cy;
    if(x>=g_grid.gridColumns){
      return true;

    }
  }
  return false;
}

TetrisObject.prototype.rotateCollision = function(){
  var tetromino = this.tetromino;
  var tetrominoCopy = this.currentTetromino;
  var tetrominoNCopy = this.tetrominoN;

  //Rotate-um þessum gervi hlut
  tetrominoNCopy = (tetrominoNCopy + 1)%tetromino.length;
  tetrominoCopy =  tetromino[tetrominoNCopy];

  for(var i = 0; i<tetrominoCopy.length; i++){
    //athugum x og y á þessum gervi tetromino hlut
    var square = tetrominoCopy[i];
    var x = square[0]+this.cx;
    var y = square[1]+this.cy;
    if(g_grid.cells[x][y].status === 2){
      return true;
    }
  }
  return false;
}

TetrisObject.prototype.backToStart = function() {

  this.cx = this.reset_cx;
  this.cy = this.reset_cy;

}

TetrisObject.prototype.reset = function (){
  for(let r = 0; r < this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = {status: 0}
  }

  g_grid.checkRows();
}

TetrisObject.prototype.killTetromino = function (){
  for(let r = 0; r<this.currentTetromino.length; r++){
    let x = this.currentTetromino[r][0] + this.cx;
    let y = this.currentTetromino[r][1] + this.cy;
    g_grid.cells[x][y] = {
      status: 2,
      sprite: this.currentTetroSprite
    }
  }
}

TetrisObject.prototype.render = function (ctx) {

  const gridRight = g_grid.cx + g_grid.gridWidth/2;
  const gridTop = g_grid.cy - g_grid.gridHeight/2;
  const gridMidVertical = g_grid.cy;

  const cellW = g_grid.cellWidth;
  const cellH = g_grid.cellHeight;
  const cellP = g_grid.cellPadding;

  const tetro = this.currentTetromino;

  // render me as the next teromino
  if (this.myState === 1) {

    ctx.font = "30px Arial";
    ctx.fillText("Next:", gridRight + 50, gridTop + 50);


    for(let r = 0; r < tetro.length; r++){
      let x = gridRight + 50 + (tetro[r][0] * cellW + tetro[r][0] * cellP);
      let y = gridTop + 75 + (tetro[r][1] * cellH + tetro[r][1] * cellP);

      this.currentTetroSprite.drawAt(ctx, x, y);
    }
  }

  //render me as the held teromino
  if (this.myState === 2) {

    ctx.font = "30px Arial";
    ctx.fillText("Holding:", gridRight + 50, gridMidVertical + 50);

    for(let r = 0; r < tetro.length; r++){
      let x = gridRight + 50 + (tetro[r][0] * cellW + tetro[r][0] * cellP);
      let y = gridMidVertical + 75 + (tetro[r][1] * cellH + tetro[r][1] * cellP);

      this.currentTetroSprite.drawAt(ctx, x, y);
    }
  }

};
