let curTetromino;
let curTetrominoColor;
let colors = ['red'];

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


function createTetro(){
  //hér þarf að búa til fylki af tilbúnum "random tetros"
  //til þess að geta sýnt svo seinna hvaða tetro er næst í listanum
  let r  = Math.floor(Math.random() * TETROMINOS.length);
  var tetrominoTEST = TETROMINOS[r][0];

  //tetramino
  curTetromino = tetrominoTEST[0];
  //liturinn
  curTetrominoColor = TETROMINOS[r][1];
}



