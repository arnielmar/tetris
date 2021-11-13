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
    // debugger;
    for(var c = 0; c <= this.gridColumns; c++){
        for(var r= 0; r <= this.gridRows; r++){
            var cellX = this.cx - (this.gridWidth / 2) + c * (this.cellWidth + this.cellPadding);
            var cellY = this.cy - (this.gridHeight / 2) + r * (this.cellHeight + this.cellPadding) + this.cellPadding;

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
    this.drawBoard(ctx);
}

// Fallið virkar til að checka hvort raðir séu fullar
// TODO - Taka röð út, lækka allt fyrir ofan um 1
Grid.prototype.checkRows = function () {
  for (let r = this.gridRows; r >= 0; r--) {
    let rowFull = true;
    for (let c = 0; c <= this.gridColumns; c++) {
      if (this.cells[c][r].status !== 1) {
        rowFull = false;
        break;
      }
    }
    if (rowFull) {
      console.log('Röðin er full');
    }
  }
}




