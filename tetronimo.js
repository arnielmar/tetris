let colors = ['red'];

let tetrominoRotations = 0;

//Hugsanlega hafa tvö föll
//createInitialTetromino
//og svo createNextTetromino
function createTetro() {
  // Þurfti að færa fylkið hingað til að hafa það ekki global svo g_sprites hlutirnir væru ekki undefined
  // Skilgreina öll pieces
  const TETROMINOS = [
    [T, g_sprites.purple],
    [I, g_sprites.turkish],
    [SQUARE, g_sprites.yellow],
    [L, g_sprites.blue],
    [L2, g_sprites.orange],
    [Z, g_sprites.green],
    [Z2, g_sprites.red]
  ];
  //hér þarf að búa til fylki af tilbúnum "random tetros"
  //til þess að geta sýnt svo seinna hvaða tetro er næst í listanum
  let r  = Math.floor(Math.random() * TETROMINOS.length);

  //til að fá annan random tetromino
  let rNext = Math.floor(Math.random() * TETROMINOS.length);
  var tetromino = TETROMINOS[r][0];
  var curTetrominoSprite = TETROMINOS[r][1];

  var nextTetrominoTEST = TETROMINOS[rNext][0];
  var nextColor = TETROMINOS[rNext][1];


  entityManager.generateObject({tetromino: tetromino,
                                tetrominoN: 0,
                                currentTetromino: tetromino[0],
                                currentTetroSprite: curTetrominoSprite,
                                nextTetromino: nextTetrominoTEST,
                                currNextTetromino: nextTetrominoTEST[0]
                              });

}





