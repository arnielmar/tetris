
let curTetrominoColor;
let colors = ['red'];

let tetrominoRotations = 0;

//Skilgreina öll pieces

const TETROMINOS = [
  [T, "purple"],
  [I, "turkish"],
  [SQUARE, "yellow"],
  [L, "blue"],
  [L2, "orange"],
  [Z, "green"],
  [Z2, "red"]
]
var curTetromino;
function createTetro(){
  //hér þarf að búa til fylki af tilbúnum "random tetros"
  //til þess að geta sýnt svo seinna hvaða tetro er næst í listanum
  let r  = Math.floor(Math.random() * TETROMINOS.length);
  //curTetromino = TETROMINOS[r][0];
  var tetrominoTEST = TETROMINOS[r][0];
  curTetrominoColor = TETROMINOS[r][1];
  //Þetta tekur inn parametra
  //spurning um að taka inn lit líka hérna
  entityManager.generateObject(
    {
      tetromino: tetrominoTEST,
      tetrominoN: 0,
      currentTetromino: tetrominoTEST[0]
    }
  );
}



