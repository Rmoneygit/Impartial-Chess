// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = { cell_size:30.55, wid:21, hgt:21 }; // JS Global var, w canvas size info.
let sz = g_canvas.cell_size;
let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
let height = sz * g_canvas.hgt;
var rminor = 80;

var piece = { x:"D", y:4 };
var start = { x:"D", y:4 };

var game_started = false;
var player = 1;

function setup() // P5 Setup Fcn
{
    var canvas = createCanvas( width, height );  // Make a P5 canvas.
    canvas.parent('canvas-holder');
    draw_grid(rminor, 'gray', 'white');
    place_chessman(piece.x, piece.y);
}

// =====================================================  draw_grid ====
// Draw a fancy grid with major & minor lines 
// & major row/col numbers.
function draw_grid( rminor, rstroke, rfill  ) 
{
    let code = 65; // Character A in ASCII
    let col = 7; // Column numbering

    stroke( rstroke );
    fill( rfill );

    for (var ix = 0; ix < width; ix += rminor)
    {
        strokeWeight(1);
        line(ix, 0, ix, height);
        textSize(12);
        strokeWeight(1);
        let letter = String.fromCharCode(code);
        fill(0, 102, 153);
        text(letter, ix + 5, height - 5);
        code += 1;
    }
    for (var iy = 0; iy < height; iy += rminor)
    {
        strokeWeight(1);
        line(0, iy, width, iy);
        strokeWeight(1);
        fill(0, 102, 153);
        text(col, 5, iy + g_canvas.hgt);
        col -= 1;
        //if ( iy % rmajor == 0 ) { text( iy, 0, iy + 10 ); }
    }
}

function place_chessman(x, y) {
    fill(0,128,0);
    textSize(50);
    let code = x.charCodeAt(0);
    let diff = code - 65;
    let xpos = diff*rminor + sz/2;
    let ypos = height - y*rminor - sz/2;
    text("♚", xpos, ypos);
}

function draw() {
    clear();
    draw_grid(rminor, 'gray', 'white');
    if(game_started) {
        highlight_legal();
    }
    place_chessman(piece.x, piece.y);
}

function mousePressed() {
    console.log(`${mouseX}, ${mouseY}`);
    for(var ix = 0; ix < width; ix += rminor) {
        let ycount = 7;
        for (var iy = 0; iy < height; iy += rminor)
        {
            if(mouseX > ix && mouseX < ix + rminor && mouseY > iy && mouseY < iy + rminor) {
                let diff = Math.ceil((ix - sz/2)/rminor);
                let code = diff + 65;
                console.log(code);
                let ch = String.fromCharCode(code);
                if(!game_started || check_move(piece.x.charCodeAt(0), piece.y, code, ycount)) {
                    move_piece(ch, ycount);
                }
            }
            ycount -= 1;
        }
    }
}

function move_piece(x, y) {
    piece.x = x;
    piece.y = y;
    console.log(`${piece.x}, ${piece.y}`);

    if(game_started) {
        if(piece.x === "A" && piece.y === 0) {
            document.getElementById('game-text').innerHTML = `Player ${player} Wins!`;
        }
        else {
            player = (player) % 2 + 1;
            document.getElementById('game-text').innerHTML = `Player ${player}\'s Turn`;
        }
    }
    else {
        start.x = x;
        start.y = y;
    }
}

function check_move(curr_x, curr_y, new_x, new_y) {
    let xdiff = curr_x - new_x;
    let ydiff = curr_y - new_y;

    if((ydiff === 0 || ydiff === 1) && ((xdiff === 0 || xdiff === 1)) && (xdiff || ydiff)) {
        return true;
    }
    return false;
}

function highlight_legal() {
    for(var horiz = 65; horiz <= 72; horiz++) {
        for(var vert = 0; vert <= 7; vert++) {
            if(check_move(piece.x.charCodeAt(0), piece.y, horiz, vert)) {
                fill(color(0, 0, 255, 50));
                let diff = horiz - 65;
                let xpos = diff*rminor;
                let ypos = height - vert*rminor - rminor;
                rect(xpos, ypos, rminor, rminor);
            }
        }
    }
}

function start_game() {
    if(!game_started) {
        game_started = true;
        document.getElementById('game_button').innerHTML = 'Quit Game';
        document.getElementById('game-text').innerHTML = `Player ${player}\'s Turn`;
    }
    else {
        game_started = false;
        player = 1;
        document.getElementById('game_button').innerHTML = 'Start Game';
        document.getElementById('game-text').innerHTML = `Place the chessman on the board.`;
        move_piece(start.x, start.y);
    }
}