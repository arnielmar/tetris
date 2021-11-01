let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;

//Coordinate array
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
    for(let y = 0; y<=456; y+=23){
        for(let x = 0; x <= 456; x+=23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i=0;
    }
}

function setUpCanvas(){

    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 598;
    canvas.height = 874;
    g_ctx.scale(2,2);
    
    // Draw gameboard rectangle
    ctx.strokeStyle = 'white';
    ctx.strokeRect(8, 8, 280, 462);


    initTetro()
    createTetro();
    createGrid();
}



