let input = [
    /* Insert AoC day 13 input here */
    "#.##..##.",
    "..#.##.#.",
    "##......#",
    "##......#",
    "..#.##.#.",
    "..##..##.",
    "#.#.##.#.",
    "",
    "#...##..#",
    "#....#..#",
    "..##..###",
    "#####.##.",
    "#####.##.",
    "..##..###",
    "#....#..#",
]

// Part 1
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

function getColumn(board, height, col) {
    let result = '';
    for(let y = 0; y < height; y++) {
        result += getValue(board, col, y);
    }
    return result;
}

function getRow(board, width, row) {
    let result = '';
    for(let x = 0; x < width; x++) {
        result += getValue(board, x, row);
    }
    return result;
}

function findReflection(board, width, height, MAX_PATTERN_BREAKERS = 0) {
    // Horizontal
    for(let x = 0; x < width - 1; x++) {
        let patternBreakers = 0;
        let mirror = true;
        let left = x;
        let right = x+1;
        while(mirror && left >= 0 && right < width) {
            let a = getColumn(board, height, left);
            let b = getColumn(board, height, right);
            if(a != b) {
                // Count number of mismatches
                for(let ci = 0; ci < a.length; ci++) {
                    if(a[ci] !== b[ci]) {
                        patternBreakers++;
                    }
                }

                if(patternBreakers > MAX_PATTERN_BREAKERS) {
                    mirror = false;
                    break;
                }
            }
            left--;
            right++;
        }

        if(mirror && patternBreakers == MAX_PATTERN_BREAKERS) {
            return (x + 1);
        }
    }

    // Vertical
    for(let y = 0; y < height - 1; y++) {
        let patternBreakers = 0;
        let mirror = true;
        let up = y;
        let down = y+1;
        while(mirror && up >= 0 && down < height) {
            let a = getRow(board, width, up);
            let b = getRow(board, width, down);
            if(a != b) {
                // Count number of mismatches
                for(let ci = 0; ci < a.length; ci++) {
                    if(a[ci] !== b[ci]) {
                        patternBreakers++;
                    }
                }
                if(patternBreakers > MAX_PATTERN_BREAKERS) {
                    mirror = false;
                    break;
                }
            }
            up--;
            down++;
        }

        if(mirror && patternBreakers == MAX_PATTERN_BREAKERS) {
            return (y + 1) * 100;
        }
    }
}

// Parse
let board = {};
let y = 0;
let sumPart1 = 0;
let sumPart2 = 0;
let width = -1;
for(let i = 0; i < input.length + 1; i++) {
    if(input[i] === '' || input[i] == undefined) {
        sumPart1 += findReflection(board, width, y);
        sumPart2 += findReflection(board, width, y, 1);

        board = {};
        y = 0;
        continue;
    }

    width = input[i].length;
    for(let x = 0; x < input[i].length; x++) {
        setValue(board, x, y, input[i][x]);
    }
    y++;
}

console.log(sumPart1);
console.log(sumPart2);