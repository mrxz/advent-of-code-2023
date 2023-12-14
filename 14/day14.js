let input = [
    /* Insert AoC day 14 input here */
    "O....#....",
    "O.OO#....#",
    ".....##...",
    "OO.#O....O",
    ".O.....O#.",
    "O.#..O.#.#",
    "..O..#O..O",
    ".......O..",
    "#....###..",
    "#OO..#....",
]

// Part 1
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

// Parse
let stones = [];

const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        let c = input[y][x];
        if(c === 'O') {
            stones.push({x, y});
            setValue(board, x, y, '.');
        } else {
            setValue(board, x, y, c);
        }
    }
}

function getAt(x, y, excludeStone) {
    for(let stone of stones) {
        if(stone === excludeStone) continue;
        if(stone.x == x && stone.y == y) {
            return 'O';
        }
    }

    return getValue(board, x, y, '#');
}

function tilt(dir) {
    let changed = false;
    do {
        changed = false;
        for(let stone of stones) {
            if(getAt(stone.x + dir.x, stone.y + dir.y, stone) === '.') {
                stone.x += dir.x;
                stone.y += dir.y;
                changed = true;
            }
        }
    } while(changed);
}

function computeSum() {
    let sum = 0;
    for(let stone of stones) {
        sum += height - stone.y;
    }
    return sum;
}

let cache = {};
function cycle(i) {
    tilt({x: 0, y: -1});
    if(i === 0) {
        // Part 1
        console.log(computeSum());
    }
    tilt({x: -1, y: 0});
    tilt({x: 0, y: 1});
    tilt({x: 1, y: 0});
    stones.sort((a,b) => a.x == b.x ? (a.y - b.y) : (a.x - b.x));
    const key = stones.map(a => `[${a.x};${a.y}]`).join('');
    if(key in cache) {
        const cycleLength = i - cache[key];
        cache[key] = i;
        return cycleLength;
    }
    cache[key] = i;
}

// Part 2
let until = 1000000000;
for(let i = 0; i <= until; i++) {
    const cycleLength = cycle(i);
    if(cycleLength !== undefined) {
        if(until === 1000000000) {
            until = i + (1000000000 - (i+1)) % cycleLength;
        }
    }
}

console.log(computeSum());





