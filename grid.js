let gridRows = 20;
let gridColumns = 10;

let cellPadding = 2;

// let cellWidth = 27;
// let cellHeight = 27;

let scoreBoardWidth = 30;   // cahnge when optimal

let cellWidth = Math.floor(g_canvas.width / (gridColumns + 1) / 2) - cellPadding;
let cellHeight = Math.floor(g_canvas.height / (gridRows + 1)) - cellPadding;
// debugger;

// debugger;



//Þetta er þá gridið okkar
const cells =[];

function generateGrid(){
    //createTetro();
    for(var c = 0; c<=gridColumns; c++){
        cells[c] = [];
        for(var r = 0; r<=gridRows; r++){
            //merkja 0 ef það er tómt
            cells[c][r] = {status: 0}
        }
    }
}

function resetGrid(){
    for(var c = 0; c<=gridColumns; c++){
        cells[c] = [];
        for(var r = 0; r<=gridRows; r++){
            //merkja 0 ef það er tómt
            cells[c][r] = {status: 0}
        }
    }
}

function drawBoard(ctx){
  // debugger;
    //Búum til einn tetro
    for(var c = 0; c<=gridColumns; c++){
        for(var r= 0; r<=gridRows; r++){
            var cellX = c*(cellWidth+cellPadding);
            var cellY = r*(cellHeight+cellPadding) + cellPadding;

            if(cells[c][r].status === 0){
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
    drawBoard(ctx);
}






