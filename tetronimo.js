let colors = ['red'];

let tetrominoRotations = 0;

//Hugsanlega hafa tvö föll
//createInitialTetromino
//og svo createNextTetromino

// give state to say what kind of tetromino
function createTetro(state = -1, coords=null, old=null) {
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
  var tetromino = TETROMINOS[r][0];
  var curTetrominoSprite = TETROMINOS[r][1];

  //til að fá annan random tetromino
  let rNext = Math.floor(Math.random() * TETROMINOS.length);
  var nextTetromino = TETROMINOS[rNext][0];
  var nextColor = TETROMINOS[rNext][1];

  // debugger;

  // making a holding tetromino is only done in the begining
  if (state === 2) {
    entityManager.generateObject({
      tetromino: null,
      tetrominoN: 0,
      currentTetromino: [],
      currentTetroSprite: null,
      myState: state
    });
  }

  if (state === 1) {
    entityManager.generateObject({
      tetromino: tetromino,
      tetrominoN: 0,
      currentTetromino: tetromino[0],
      currentTetroSprite: curTetrominoSprite,
      myState: state,
      old: old
    });
  }

  if (state === 0) {
    entityManager.generateObject({
      tetromino: tetromino,
      tetrominoN: 0,
      currentTetromino: tetromino[0],
      currentTetroSprite: curTetrominoSprite,
      myState: state
    });
  }



}

function createNextTetro(){

  //Ferlið er þá að í upphafi eru búnir til tveir hlutir
  //þegar tetro hlutur er drepinn þá er núverandi tetro settur sem nextTetro
  // eitthvað í þessa áttina tetromino=nextTetromino

  //Svo köllum við alltaf á þetta fall til að generate-a næsta tetromino-ið til að sýna notendanum

  //Get svo almennilega testað þetta þegar allt collision dótið er komið
  let r  = Math.floor(Math.random() * TETROMINOS.length);
  var tetromino = TETROMINOS[r][0];

  //vantar lit
  entityManager.generateObject({nextTetromino: nextTetrominoTEST,
                                currNextTetromino: nextTetrominoTEST[0]
                              });
}


