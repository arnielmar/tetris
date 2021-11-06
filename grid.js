let rows = 20;
let columns=10;

let cellWidth = 27;
let cellHeight = 27;
let cellPadding = 2;

//Þetta er þá gridið okkar
let cells =[];

function generateGrid(){
    //createTetro();
    for(var c = 0; c<=columns; c++){
        cells[c] = [];
        for(var r = 0; r<=rows; r++){
            //merkja 0 ef það er tómt
            cells[c][r] = {status: 0}
        }
    }
}

function resetGrid(){
    for(var c = 0; c<=columns; c++){
        cells[c] = [];
        for(var r = 0; r<=rows; r++){
            //merkja 0 ef það er tómt
            cells[c][r] = {status: 0}
        }
    }
}

function drawBoard(ctx){
    //Búum til einn tetro
    for(var c = 0; c<=columns; c++){
        for(var r= 0; r<=rows; r++){
            var cellX = c*(cellHeight+cellPadding);
            var cellY = r*(cellWidth+cellPadding);
            
            if(cells[c][r].status ===0){
                //Þá er þetta empty space
                //TODO tengja svo sprite við þetta
                //á meðan teiknum við bara kassa
                ctx.beginPath();
                ctx.rect(cellX,cellY,cellWidth,cellHeight);
                ctx.fillStyle = 'white';
                ctx.fill(); 
            }else{
                ctx.beginPath();
                ctx.rect(cellX,cellY,cellWidth,cellHeight);
                ctx.fillStyle = curTetrominoColor;
                ctx.fill(); 
            }
            
            //Annars er þetta partur af tetramino

        }
    }

}

function setUpCanvas(ctx){
    generateGrid();
    //initTetro();
    createTetro();
    drawBoard(ctx);
}




//Coordinate array
/*
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let gridArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
class Coordinates{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

function createGrid(){
    let i = 0, j = 0;
    for(let y = 0; y<456; y+=23){
        for(let x = 0; x < 456; x+=23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i=0;
    }
}

function setUpCanvas(){

    g_canvas.width = 598;
    g_canvas.height = 483;
    //g_ctx.scale(2,2);
    
    // Draw gameboard rectangle


    initTetro()
    createTetro();
    createGrid();
}
*/

//Ætla frekar að testa þetta eins og ég geri með brakeout





