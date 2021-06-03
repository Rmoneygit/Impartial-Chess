// Make global g_canvas JS 'object': a key-value 'dictionary'.
var g_canvas = { cell_size:80, wid:8, hgt:8 }; // JS Global var, w canvas size info.
let sz = g_canvas.cell_size;
let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
let height = sz * g_canvas.hgt;

var type = "♚";
var piece = { x:"D", y:4 };
var start = { x:"D", y:4 };

var game_started = false;
var player = 1;

function setup() // P5 Setup Fcn
{
    var canvas = createCanvas( width, height );  // Make a P5 canvas.
    canvas.parent('canvas-holder');
    draw_grid(sz, 'gray', 'white');
    place_chessman(type, piece.x, piece.y);
}

function draw_grid(sz, rstroke, rfill ) 
{
    let code = 65; // Character A in ASCII
    let col = g_canvas.hgt - 1; // Column numbering

    stroke( rstroke );
    fill( rfill );

    for (var ix = 0; ix < width; ix += sz)
    {
        strokeWeight(1);
        line(ix, 0, ix, height);
        let font_sz = sz * 0.15;
        textSize(font_sz);
        strokeWeight(1);
        let letter = String.fromCharCode(code);
        fill(0, 102, 153);
        text(letter, ix + sz * 0.0625, height - sz * 0.0625);
        code += 1;
    }
    for (var iy = 0; iy < height; iy += sz)
    {
        strokeWeight(1);
        line(0, iy, width, iy);
        strokeWeight(1);
        fill(0, 102, 153);
        text(col, sz * 0.0625, iy + sz * 0.1875);
        col -= 1;
    }
}

function place_chessman(type, x, y) {
    fill(0,128,0);
    let font_sz = sz * 0.625;
    textSize(font_sz);
    let code = x.charCodeAt(0);
    let diff = code - 65;
    let xpos = diff*sz + sz * 0.2;
    let ypos = height - y*sz - sz * 0.3;
    text(type, xpos, ypos);
}

function draw() {
    clear();
    draw_grid(sz, 'gray', 'white');
    if(game_started) {
        highlight_legal();
    }
    place_chessman(type, piece.x, piece.y);
}

function mousePressed() {
    console.log(`${mouseX}, ${mouseY}`);
    for(var ix = 0; ix < width; ix += sz) {
        let ycount = g_canvas.hgt - 1;
        for (var iy = 0; iy < height; iy += sz)
        {
            if(mouseX > ix && mouseX < ix + sz && mouseY > iy && mouseY < iy + sz) {
                let diff = Math.ceil((ix - sz/2)/sz);
                let code = diff + 65;
                console.log(code);
                let ch = String.fromCharCode(code);
                if(!game_started || check_move(type, piece.x.charCodeAt(0), piece.y, code, ycount)) {
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
        if(!highlight_legal()) {
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

function check_move(type, curr_x, curr_y, new_x, new_y) {
    let xdiff = curr_x - new_x;
    let ydiff = curr_y - new_y;

    if(type === "♚") {
        if((ydiff === 0 || ydiff === 1) && ((xdiff === 0 || xdiff === 1)) && (xdiff || ydiff)) {
            return true;
        }
    }
    else if(type === "♞") {
        if((xdiff === 2 && (ydiff === -1 || ydiff === 1) || (ydiff === 2 && (xdiff === -1 || xdiff === 1)))) {
            return true;
        }
    }
    else if(type === "♜") {
        if((xdiff > 0 && ydiff === 0) || (ydiff > 0 && xdiff === 0)) {
            return true;
        }
    }
    else if(type === "♝") {
        if((xdiff === ydiff) &&  (xdiff > 0 && ydiff > 0)) {
            return true;
        }
    }
    return false;
}

function highlight_legal() {
    let highlights = 0;
    let last_let = 65 + g_canvas.wid - 1;
    for(var horiz = 65; horiz <= last_let; horiz++) {
        for(var vert = 0; vert <= g_canvas.hgt; vert++) {
            if(check_move(type, piece.x.charCodeAt(0), piece.y, horiz, vert)) {
                fill(color(0, 0, 255, 50));
                let diff = horiz - 65;
                let xpos = diff*sz;
                let ypos = height - vert*sz - sz;
                rect(xpos, ypos, sz, sz);
                highlights++;
            }
        }
    }
    return highlights;
}

function start_game() {
    if(!game_started) {
        game_started = true;
        document.getElementById('game_button').innerHTML = 'Quit Game';
        document.getElementById('game-text').innerHTML = `Player ${player}\'s Turn`;
        document.getElementById('type-picker').disabled = true;
        document.getElementById('rows').disabled = true;
        document.getElementById('cols').disabled = true;
    }
    else {
        game_started = false;
        player = 1;
        document.getElementById('game_button').innerHTML = 'Start Game';
        document.getElementById('game-text').innerHTML = `Place the chessman on the board.`;
        document.getElementById('type-picker').disabled = false;
        document.getElementById('rows').disabled = false;
        document.getElementById('cols').disabled = false;
        move_piece(start.x, start.y);
    }
}

function change_piece() {
    if(!game_started) {
        type = document.getElementById('type-picker').value;
    }
}

function resize_board() {
    g_canvas.hgt = parseInt(document.getElementById('rows').value);
    g_canvas.wid = parseInt(document.getElementById('cols').value);
    sz = g_canvas.cell_size;
    width = sz * g_canvas.wid;
    height = sz * g_canvas.hgt;
    let code = piece.x.charCodeAt(0);
    let horiz = code - 65;
    if(horiz > g_canvas.wid - 1) {
        let ch = String.fromCharCode(code - 1);
        move_piece(ch, piece.y);
    }
    if(piece.y > 0) {
        move_piece(piece.x, piece.y - 1);
    }
}