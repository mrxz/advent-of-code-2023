let input = [
    /* Insert AoC day 16 input here, and escape '\' (sorry) */
    ".|...\\....",
    "|.-.\\.....",
    ".....|-...",
    "........|.",
    "..........",
    ".........\\",
    "..../.\\\\..",
    ".-.-/..|..",
    ".|....-|.\\",
    "..//.|....",
]

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] || fallback
}

// Parse
const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        setValue(board, x, y, input[y][x]);
    }
}

function count(startPos, startDir) {
    const energizedBoard = {};
    const tiles = {};
    const seenStates = {};

    function energize(pos, dir) {
        const stateKey = `${pos.x}|${pos.y}|${dir.x}|${dir.y}`;
        if(stateKey in seenStates) {
            return;
        }
        seenStates[stateKey] = true;

        // Energize current tile
        const key = `${pos.x}|${pos.y}`;
        tiles[key] = true;
        setValue(energizedBoard, pos.x, pos.y, '#');

        const nextPos = {x: pos.x + dir.x, y: pos.y + dir.y};
        const v = getValue(board, nextPos.x, nextPos.y, '#');
        if(v === '#') {
            return;
        }

        if(v === '.') {
            energize(nextPos, dir);
        } else if(v === '/') {
            if(dir.x === 1) {
                energize(nextPos, {x:0,y:-1});
            } else if(dir.x === -1) {
                energize(nextPos, {x:0,y:1});
            } else if(dir.y === 1) {
                energize(nextPos, {x:-1,y:0});
            } else {
                energize(nextPos, {x:1,y:0});
            }
        } else if(v === '\\') {
            if(dir.x === 1) {
                energize(nextPos, {x:0,y:1});
            } else if(dir.x === -1) {
                energize(nextPos, {x:0,y:-1});
            } else if(dir.y === 1) {
                energize(nextPos, {x:1,y:0});
            } else {
                energize(nextPos, {x:-1,y:0});
            }
        } else if(v === '-') {
            if(dir.y !== 0) {
                energize(nextPos, {x:1,y:0});
                energize(nextPos, {x:-1,y:0});
            } else {
                energize(nextPos, dir);
            }
        } else if(v === '|') {
            if(dir.x !== 0) {
                energize(nextPos, {x:0, y:1});
                energize(nextPos, {x:0, y:-1});
            } else {
                energize(nextPos, dir);
            }
        }
    }

    energize(startPos, startDir);
    return Object.keys(tiles).length - 1;
}

// Part 1
console.log(count({x: -1, y: 0}, {x:1, y:0}));

// Part 2
let max = -1;
for(let x = 0; x < width; x++) {
    max = Math.max(max, count({x: x, y: -1}, {x:0, y:1}));
    max = Math.max(max, count({x: x, y: height}, {x:0, y:-1}));
}
for(let y = 0; y < height; y++) {
    max = Math.max(max, count({x: -1, y: y}, {x:1, y:0}));
    max = Math.max(max, count({x: width, y: y}, {x:-1, y:0}));
}
console.log(max);