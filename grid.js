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
            //bætist við ef gæji deyr þá er hann merktur með 2 
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
    drawBoard(ctx);
}






