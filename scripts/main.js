// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = { cell_size:30.55, wid:21, hgt:21 }; // JS Global var, w canvas size info.
var piece_x = "D"
var piece_y = 4
var game_started = false;
var start_x = "D"
var start_y = 4
var player = 1;

function setup() // P5 Setup Fcn
{
    let sz = g_canvas.cell_size;
    let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
    let height = sz * g_canvas.hgt;
    var canvas = createCanvas( width, height );  // Make a P5 canvas.
    canvas.parent('canvas-holder');
    draw_grid(80, 80, 'gray', 'white');
    place_chessman(piece_x, piece_y);
}

// =====================================================  draw_grid ====
// Draw a fancy grid with major & minor lines 
// & major row/col numbers.
function draw_grid( rminor, rmajor, rstroke, rfill  ) 
{
    stroke( rstroke );
    fill( rfill );
    let sz = g_canvas.cell_size;
    let width = g_canvas.wid*sz;
    let height = g_canvas.hgt*sz;
    let code = 65; // Character A in ASCII
    let col = 7; // Column numbering
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
    let sz = g_canvas.cell_size;
    let height = sz * g_canvas.hgt;
    let diff = code - 65;
    let xpos = diff*80 + sz/2;
    let ypos = height - y*80 - sz/2;
    text("♚", xpos, ypos);
}

function draw() {
    clear();
    draw_grid(80, 80, 'gray', 'white');
    if(game_started) {
        highlight_legal();
    }
    place_chessman(piece_x, piece_y);
}

function mousePressed() {
    let sz = g_canvas.cell_size;
    let width = g_canvas.wid*sz;
    let height = g_canvas.hgt*sz;
    let rminor = 80;
    console.log(`${mouseX}, ${mouseY}`);
    for(var ix = 0; ix < width; ix += rminor) {
        let ycount = 7;
        for (var iy = 0; iy < height; iy += rminor)
        {
            if(mouseX > ix && mouseX < ix + rminor && mouseY > iy && mouseY < iy + rminor) {
                let diff = Math.ceil((ix - sz/2)/80);
                let code = diff + 65;
                console.log(code);
                let ch = String.fromCharCode(code);
                if(!game_started || check_move(piece_x.charCodeAt(0), piece_y, code, ycount)) {
                    move_piece(ch, ycount);
                }
            }
            ycount -= 1;
        }
    }
}

function move_piece(x, y) {
    piece_x = x;
    piece_y = y;
    console.log(`${piece_x}, ${piece_y}`);

    if(game_started) {
        player = (player) % 2 + 1;
        document.getElementById('game-text').innerHTML = `Player ${player}\'s Turn`;

        if(piece_x === "A" && piece_y === 0) {
            document.getElementById('game-text').innerHTML = `Player ${player} Wins!`;
        }
    }
    else {
        start_x = x;
        start_y = y;
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
            if(check_move(piece_x.charCodeAt(0), piece_y, horiz, vert)) {
                fill(color(0, 0, 255, 50));
                let sz = g_canvas.cell_size;
                let height = sz * g_canvas.hgt;
                let diff = horiz - 65;
                let xpos = diff*80;
                let ypos = height - vert*80 - 80;
                rect(xpos, ypos, 80, 80);
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
        move_piece(start_x, start_y);
    }
}