"use strict";

Grid.prototype - new Entity();

function Grid(descr) {
  for (var property in descr) {
    this[property] = descr[property];
  }

  // dynamic size
  this.cellWidth = Math.floor(this.gridWidth / (this.gridColumns + 1)) - this.cellPadding;
  this.cellHeight = Math.floor(this.gridHeight / (this.gridRows + 1)) - this.cellPadding;
}

// ef leikmaður er búinn að tapa
Grid.prototype.lost = false;
Grid.prototype.lostAnimationToggle = false;
Grid.prototype.lostAnimationDone = false;


// stærðar breytur
Grid.prototype.gridRows = 20;
Grid.prototype.gridColumns = 10;

// staðs. breytur
Grid.prototype.gridWidth = 100;
Grid.prototype.gridHeight = 100;
Grid.prototype.cx = 50;
Grid.prototype.cy = 50;

// cell breytur
Grid.prototype.cellPadding = 2;
Grid.prototype.cellWidth = 30;
Grid.prototype.cellHeight = 30;

//Þetta er þá gridið okkar
Grid.prototype.cells = [];

Grid.prototype.generateGrid = function (){
    //createTetro();
    for(var c = 0; c <= this.gridColumns; c++){
        this.cells[c] = [];
        for(var r = 0; r <= this.gridRows; r++){
            //merkja 0 ef það er tómt
            this.cells[c][r] = {status: 0}
        }
    }
}

Grid.prototype.resetGrid = function (){
    for(var c = 0; c <= this.gridColumns; c++){
      this.cells[c] = [];
        for(var r = 0; r <= this.gridRows; r++){
            //merkja 0 ef það er tómt

            this.cells[c][r] = {status: 0}

        }
    }
}

Grid.prototype.drawBoard = function (ctx){
  //Búum til einn tetro

    for(var c = 0; c <= this.gridColumns; c++){
        for(var r= 0; r <= this.gridRows; r++){
            var cellX = this.cx - (this.gridWidth / 2) + c * (this.cellWidth + this.cellPadding);
            var cellY = this.cy - (this.gridHeight / 2) + r * (this.cellHeight + this.cellPadding) + this.cellPadding;
            if (this.lost && !this.lostAnimationToggle) {
              // util.fillBox(ctx, cellX, cellY, this.cellWidth, this.cellHeight, "blue");

              if (this.cells[c][r].status === 2) {
                this.cells[c][r].sprite.drawAt(ctx, cellX, cellY);
              }


              if (this.cells[c][r].status !== 2) {
                this.lostAnimationToggle = true;

                var keys = Object.keys(g_sprites);

                const index = keys.indexOf("empty");
                if (index > -1) {
                  keys.splice(index, 1);
                }

                const theSprite = g_sprites[keys[Math.floor(Math.random()*keys.length)]];

                this.cells[c][r] = {status: 2, sprite: theSprite};
              }

              if (c === this.gridColumns && r === this.gridRows) {
                this.lostAnimationDone = true;
              }
            } else {
              if(this.cells[c][r].status === 0){
                  g_sprites.empty.drawAt(ctx, cellX, cellY);
              }else{
                  // Teikna sprite á þessu cell
                  this.cells[c][r].sprite.drawAt(ctx, cellX, cellY);
              }
              //Annars er þetta partur af tetramino
            }
        }
    }

    // reset this param for next iteration
    this.lostAnimationToggle = false;

    if (this.lostAnimationDone) {
      // this.resetGrid();
      this.drawFinalScore(ctx);
    }

}

Grid.prototype.drawFinalScore = function (ctx) {


  const startX = this.cx - this.gridWidth*3/8;
  const startY = this.cy - this.gridHeight*2/8;
  const myWidth = 6/8*this.gridWidth;
  const myHeight = 4/8*this.gridHeight;

  util.fillBox(ctx, startX, startY, myWidth, myHeight, "black");

  ctx.save();

  ctx.font = '32px serif';
  ctx.textAlign = "center";
  ctx.fillText('Final score', startX + myWidth/2, startY + myHeight/8);

  ctx.font = '48px serif';
  ctx.fillText(`${"XXX"}`, startX + myWidth/2, startY + myHeight/2);

  ctx.restore();

}


Grid.prototype.isOccupied = function (x, y) {
  // 0 = blank space, 1 = moving tetris object
  const stat = this.cells[x][y].status
  if (stat !== 0 && stat !== 1) return true;
  return false;
}

Grid.prototype.occupy - function (x, y, colorcode) {
  this.cells[x][y].status = colorcode;
}

Grid.prototype.setUpCanvas = function (ctx){
    this.generateGrid();
    // this.drawBoard(ctx);
}






