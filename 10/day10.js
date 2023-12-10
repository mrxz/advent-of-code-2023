// NOTE: Due to unoptimized recursion, you might need to increase the call stack
//       > node --stack_size=8192 day10.js
let input = [
    /* Insert AoC day 10 input here */
    ".F----7F7F7F7F-7....",
    ".|F--7||||||||FJ....",
    ".||.FJ||||||||L7....",
    "FJL7L7LJLJ||LJ.L-7..",
    "L--J.L7...LJS7F-7L7.",
    "....F-J..F7FJ|L7L7L7",
    "....L7.F7||L7|.L7L7|",
    ".....|FJLJ|FJ|F7|.LJ",
    "....FJL-7.||.||||...",
    "....L---J.LJ.LJLJ...",
]

// Figure out the starting pipe yourself, sorry
let startingPipe = 'F';

let startPos = {x: -1, y: -1}

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] || fallback
}
const printBoard = (board, xi, yi, width, height) => {
    for(let y = yi; y < height; y++) {
        let line = ""
        for(let x = xi; x < width; x++) {
            line += getValue(board, x, y, '.');
        }
        console.log(line);
    }
}

const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        if(input[y][x] === 'S') {
            startPos.x = x;
            startPos.y = y;
            setValue(board, x, y, startingPipe);
        } else {
            setValue(board, x, y, input[y][x]);
        }
    }
}

// Part 1
let visited = {};

const bfs = (initialState) => {
    let queue = [initialState];
    let seenKey = (state) => `${state.x}|${state.y}`
    let i = 0;
    let max = 0;

    while(queue.length) {
        const nextQueue = [];
        i++;

        for(let state of queue) {
            const stateKey = seenKey(state);
            if(stateKey in visited) {
                continue;
            }
            visited[stateKey] = true

            max = Math.max(i, max);

            // Find neighbours
            const current = getValue(board, state.x, state.y, '.');
            switch(current) {
                case '|':
                    nextQueue.push({x: state.x, y: state.y + 1});
                    nextQueue.push({x: state.x, y: state.y - 1});
                    break;
                case '-':
                    nextQueue.push({x: state.x + 1, y: state.y});
                    nextQueue.push({x: state.x - 1, y: state.y});
                    break;
                case 'L':
                    nextQueue.push({x: state.x + 1, y: state.y});
                    nextQueue.push({x: state.x, y: state.y - 1});
                    break;
                case 'J':
                    nextQueue.push({x: state.x - 1, y: state.y});
                    nextQueue.push({x: state.x, y: state.y - 1});
                    break;
                case '7':
                    nextQueue.push({x: state.x - 1, y: state.y});
                    nextQueue.push({x: state.x, y: state.y + 1});
                    break;
                case 'F':
                    nextQueue.push({x: state.x + 1, y: state.y});
                    nextQueue.push({x: state.x, y: state.y + 1});
                    break;
            }
        }

        queue = nextQueue;
    }

    console.log(max - 1);
}

bfs(startPos);

// Part 2
const mask = {};
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        let seenKey = `${x}|${y}`
        if(seenKey in visited) {
            setValue(mask, x, y, '#');
        } else {
            setValue(mask, x, y, '.');
        }
    }
}

// Simple floodFill
function floodFill(x, y, c, board = mask) {
    const v = getValue(board, x, y);
    if(v === '.') {
        setValue(board, x, y, c);
        floodFill(x -1, y - 1, c, board)
        floodFill(x, y - 1, c, board)
        floodFill(x + 1, y - 1, c, board)

        floodFill(x -1, y, c, board)
        floodFill(x + 1, y, c, board)

        floodFill(x -1, y + 1, c, board)
        floodFill(x, y + 1, c, board)
        floodFill(x + 1, y + 1, c, board)
    }
}

// Scale up board using mask
let scaled = {};
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        let v = getValue(mask, x, y);
        setValue(scaled, x*3, y*3, '.');
        setValue(scaled, x*3+1, y*3, '.');
        setValue(scaled, x*3+2, y*3, '.');
        setValue(scaled, x*3, y*3+1, '.');
        setValue(scaled, x*3+1, y*3+1, '.');
        setValue(scaled, x*3+2, y*3+1, '.');
        setValue(scaled, x*3, y*3+2, '.');
        setValue(scaled, x*3+1, y*3+2, '.');
        setValue(scaled, x*3+2, y*3+2, '.');
        if(v === 'O') {
            setValue(scaled, x*3, y*3, 'O');
            setValue(scaled, x*3+1, y*3, 'O');
            setValue(scaled, x*3+2, y*3, 'O');
            setValue(scaled, x*3, y*3+1, 'O');
            setValue(scaled, x*3+1, y*3+1, 'O');
            setValue(scaled, x*3+2, y*3+1, 'O');
            setValue(scaled, x*3, y*3+2, 'O');
            setValue(scaled, x*3+1, y*3+2, 'O');
            setValue(scaled, x*3+2, y*3+2, 'O');
        } else if(v === '#') {
            v = getValue(board, x, y);
            switch(v) {
                case '|':
                    setValue(scaled, x*3+1, y*3, '#');
                    setValue(scaled, x*3+1, y*3+1, '#');
                    setValue(scaled, x*3+1, y*3+2, '#');
                    break;
                case '-':
                    setValue(scaled, x*3, y*3+1, '#');
                    setValue(scaled, x*3+1, y*3+1, '#');
                    setValue(scaled, x*3+2, y*3+1, '#');
                    break;
                case 'F':
                    setValue(scaled, x*3+1, y*3+2, '#');
                    setValue(scaled, x*3+1, y*3+1, '#');
                    setValue(scaled, x*3+2, y*3+1, '#');
                    break;
                case 'S':
                case '7':
                    setValue(scaled, x*3+1, y*3+2, '#');
                    setValue(scaled, x*3+1, y*3+1, '#');
                    setValue(scaled, x*3, y*3+1, '#');
                    break;
                case 'J':
                    setValue(scaled, x*3+1, y*3, '#');
                    setValue(scaled, x*3+1, y*3+1, '#');
                    setValue(scaled, x*3, y*3+1, '#');
                    break;
                case 'L':
                    setValue(scaled, x*3+1, y*3, '#');
                    setValue(scaled, x*3+1, y*3+1, '#');
                    setValue(scaled, x*3+2, y*3+1, '#');
                    break;
            }
        }
    }
}

// Flood fill mark all external tiles (and sub-tiles)
for(let x = 0; x < width*3; x++) {
    floodFill(x, 0, 'O', scaled)
    floodFill(x, height*3 - 1, 'O', scaled)
}
for(let y = 0; y < height*3; y++) {
    floodFill(0, y, 'O', scaled)
    floodFill(width*3 - 1, y, 'O', scaled)
}

// Count interior tiles
let count = 0;
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        let valid = true;
        valid &= getValue(scaled, x*3, y*3) == '.';
        valid &= getValue(scaled, x*3-1, y*3) == '.';
        valid &= getValue(scaled, x*3+1, y*3) == '.';
        valid &= getValue(scaled, x*3, y*3+1) == '.';
        valid &= getValue(scaled, x*3, y*3-1) == '.';
        valid &= getValue(scaled, x*3-1, y*3-1) == '.';
        valid &= getValue(scaled, x*3+1, y*3-1) == '.';
        valid &= getValue(scaled, x*3-1, y*3+1) == '.';
        valid &= getValue(scaled, x*3+1, y*3+1) == '.';
        if(valid) {
            count++;
        }
    }
}

console.log(count);