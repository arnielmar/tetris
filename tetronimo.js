
let curTetrominoColor;
let colors = ['red'];

let tetrominoRotations = 0;

//Skilgreina öll pieces

const TETROMINOS = [
  [T, "red"],
  [I, "blue"],
  [SQUARE, "purple"],
  [L, "cyan"],
  [L2, "brown"],
  [Z, "green"],
  [Z2, "yellow"]
]
var curTetromino;
//Hugsanlega hafa tvö föll
//createInitialTetromino
//og svo createNextTetromino
function createTetro(){
  //hér þarf að búa til fylki af tilbúnum "random tetros"
  //til þess að geta sýnt svo seinna hvaða tetro er næst í listanum
  let r  = Math.floor(Math.random() * TETROMINOS.length);

  //til að fá annan random tetromino
  let rNext = Math.floor(Math.random() * TETROMINOS.length);
  //curTetromino = TETROMINOS[r][0];
  var tetromino = TETROMINOS[r][0];
  curTetrominoColor = TETROMINOS[r][1];

  var nextTetrominoTEST = TETROMINOS[rNext][0];
  var nextColor = TETROMINOS[rNext][1];
  
  entityManager.generateObject({tetromino: tetromino, 
                                tetrominoN: 0,
                                currentTetromino: tetromino[0],
                                nextTetromino: nextTetrominoTEST,
                                currNextTetromino: nextTetrominoTEST[0]
                              });

}



