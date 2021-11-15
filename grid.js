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

// Scoring system
Grid.prototype.lines = 0;
Grid.prototype.level = 1;
Grid.prototype.speed = 1000;
Grid.prototype.score = 0;

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

Grid.prototype._checkLevelUp = function (rows) {
  // Bæta línum við og athuga hvort level sé að breytast
  this.lines += rows;
  // Checka hvort við séum að levela upp
  if (this.lines >= 10) {
    this.lines = this.lines % 10;   // Lækka um 10 svo ég geti haldið utan um hvenær á að levela upp
    this.level++;                   // Hækka level um 1
    // Lækka speed um 100 nema það sé nú þegar á hraðasta
    if (this.speed > 100) {
      this.speed -= 100;
    }
  }

  let levelElem = document.getElementById('level');
  levelElem.innerHTML = this.level;
}

Grid.prototype._addScore = function (rows) {
  // Virkar ekki alveg rétt því það er kallað svo oft á þetta að rowsFull er aldrei meira en 1
  // Bæta við score (original Nintendo Tetris scoring system)
  switch (rows) {
    // Engin lína sprengd
    case 0:
      break;
    // 1 lína sprengd
    case 1:
      this.score += (40 * this.level);
      break;
    // 2 línur sprengdar
    case 2:
      this.score += (100 * this.level);
      break;
    // 3 línur sprengdar
    case 3:
      this.score += (300 * this.level);
      break;
    // 4 eða fleiri línur sprengdar
    default:
      this.score += (1200 * this.level);
      break;
  }
  let scoreElem = document.getElementById('score');
  scoreElem.innerHTML = this.score;
}

Grid.prototype.checkRows = function () {
  // Halda utan um fullar raðir til að skila til baka í tetrisobject
  let rowsFull = 0;
  for (let r = this.gridRows; r >= 0; r--) {
    let rowFull = true;
    for (let c = 0; c <= this.gridColumns; c++) {
      if (this.cells[c][r].status !== 1) {
        rowFull = false;
        break;
      }
    }
    if (rowFull) {
      rowsFull += 1;
      for (let c = 0; c <= this.gridColumns; c++) {
        this.cells[c][r].status = 0;
      }
      for (let row = r-1; row >= 0; row--) {
        for (let col = 0; col <= this.gridColumns; col++) {
          if (this.cells[col][row].status === 1) {
            this.cells[col][row].status = 0;    // Set status á þessum sem 0 til að lækka um eina röð
            this.cells[col][row+1].status = 1;  // Set status á cell í röð fyrir neðan sem 1
          }
        }
      }
    }
  }

  let linesElem = document.getElementById('lines');
  linesElem.innerHTML = this.lines;

  // Athuga hvort level up
  this._checkLevelUp(rowsFull)

  // Bæta við score
  this._addScore(rowsFull);
  console.log('this.score :>> ', this.score);
}




