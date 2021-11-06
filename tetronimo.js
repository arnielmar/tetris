let curTetromino;
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
var tetrominoTEST

function createTetro(){
  //hér þarf að búa til fylki af tilbúnum "random tetros"
  //til þess að geta sýnt svo seinna hvaða tetro er næst í listanum
  let r  = Math.floor(Math.random() * TETROMINOS.length);
  tetrominoTEST = TETROMINOS[r][0];

  //tetramino
  curTetromino = tetrominoTEST[tetrominoRotations];
  //liturinn
  curTetrominoColor = TETROMINOS[r][1];

  //Þetta tekur inn parametra
  entityManager.generateObject({})
  //frekar kalla hérna á new object, með curTetro sem parameter og curTetroColor.
}



