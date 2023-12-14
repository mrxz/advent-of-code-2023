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

const height = input.length;
const width = input[0].length;

// Part 1
const board = new Array(width, height);
const getKey = (x,y) => y*width + x;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    if(x < 0 || y < 0 || x >= width || y >= height) return fallback;
    return board[getKey(x, y)]
}

// Parse
let stones = [];

for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        let c = input[y][x];
        if(c === 'O') {
            const stone = {x, y};
            stones.push(stone);
            setValue(board, x, y, stone);
        } else {
            setValue(board, x, y, c);
        }
    }
}

function tilt(dir) {
    stones.sort((a,b) => (a.x - b.x) * -dir.x + (a.y - b.y) * -dir.y);
    for(let stone of stones) {
        while(getValue(board, stone.x + dir.x, stone.y + dir.y, '#') === '.') {
            setValue(board, stone.x, stone.y, '.');
            stone.x += dir.x;
            stone.y += dir.y;
            setValue(board, stone.x, stone.y, stone);
        }
    }
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





