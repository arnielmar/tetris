let curTetromino;
let curTetrominoColor;
let colors = ['red'];

//Þetta á ekki heima hérna held ég
var tetrominos = [];
function initTetro(){
  //T shape
  tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
  //I shape
  tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
  //J shape
  tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
  //Square shape
  tetrominos.push([[0,0], [1,0], [0,1], [1,1]])
  //L shape
  tetrominos.push([[2,0], [0,1], [1,1], [2,1]])
  //S shape
  tetrominos.push([[1,0], [2,0], [0,1], [1,1]])
  //Z shape
  tetrominos.push([[0,0], [1,0], [1,1], [2,1]])
}

function createTetro(){
  var randomTetro = Math.floor(Math.random()*tetrominos.length);
  curTetromino = tetrominos[randomTetro]
}


