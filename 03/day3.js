let input = [
    /* Insert AoC day 3 input here */
    "467..114..",
    "...*......",
    "..35..633.",
    "......#...",
    "617*......",
    ".....+.58.",
    "..592.....",
    "......755.",
    "...$.*....",
    ".664.598..",
]

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
        setValue(board, x, y, input[y][x]);
    }
}

printBoard(board, 0, 0, width, height)

// Part 1
let sum = 0;

let gears = {};
let pendingGears = []

const isSymbol = (board, x, y) => {
    const c = getValue(board, x, y, '.');
    if(c === '*') {
        // Found a gear
        if(!pendingGears.some(g => g.x === x && g.y === y)) {
            pendingGears.push({x, y});
        }
    }

    return !Number.isInteger(+c) && c !== '.';
}

for(let y = 0; y < height; y++) {
    var numberStart = -1;
    var validNumber = false;
    for(let x = 0; x < width + 1; x++) { // +1 for handling trailing numbers
        const value = getValue(board, x, y, '.');
        if(Number.isInteger(+value)) {
            if(numberStart === -1) {
                numberStart = x;
            }

            // Check neighbours
            // (Part 2) numbers never seem to connect to more than 1 gear, so shortcircuiting is fine...
            if(!validNumber) {
                if(isSymbol(board, x - 1, y)) {
                    validNumber = true;
                }
                if(isSymbol(board, x + 1, y)) {
                    validNumber = true;
                }
                if(isSymbol(board, x, y - 1)) {
                    validNumber = true;
                }
                if(isSymbol(board, x, y + 1)) {
                    validNumber = true;
                }

                // Diagonals
                if(isSymbol(board, x - 1, y - 1)) {
                    validNumber = true;
                }
                if(isSymbol(board, x - 1, y + 1)) {
                    validNumber = true;
                }
                if(isSymbol(board, x + 1, y - 1)) {
                    validNumber = true;
                }
                if(isSymbol(board, x + 1, y + 1)) {
                    validNumber = true;
                }
            }
        } else {
            if(numberStart !== -1) {
                var number = input[y].substring(numberStart, x);
                if(validNumber) {
                    sum += +number;
                    pendingGears.forEach(g => {
                        const key = `${g.x}|${g.y}`;
                        gears[key] = (gears[key] || []);
                        gears[key].push(+number);
                    });
                }
                numberStart = -1;
                pendingGears = [];
                validNumber = false;
            }
        }
    }
}

console.log(sum)

// Part 2
let sum2 = 0;
for(const gear of Object.values(gears)) {
    if(gear.length !== 2) {
        continue;
    }

    sum2 += gear[0]*gear[1];
}
console.log(sum2);