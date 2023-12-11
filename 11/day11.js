let input = [
    /* Insert AoC day 11 input here */
    "...#......",
    ".......#..",
    "#.........",
    "..........",
    "......#...",
    ".#........",
    ".........#",
    "..........",
    ".......#..",
    "#...#.....",
]

// Find empty rows
let emptyRows = [];
let emptyCols = [];
for(let y = 0; y < input.length; y++) {
    if([...input[y]].some(c => c === '#')) {
        continue;
    }
    emptyRows.push(y);
}

function transpose(rows) {
    let result = [];
    for(let x = 0; x < rows[0].length; x++) {
        result[x] = "";
        for(let y = 0; y < rows.length; y++) {
            result[x] += input[y][x];
        }
    }
    return result;
}
// Find empty colums
input = transpose(input);
for(let y = 0; y < input.length; y++) {
    if([...input[y]].some(c => c === '#')) {
        continue;
    }
    emptyCols.push(y);
}
input = transpose(input);

// Part 1
let galaxies = [];

const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        if(input[y][x] === '#') {
            galaxies.push({x, y});
        }
    }
}

function computeSum(expansion) {
    return galaxies.map(g => {
        let options = galaxies.filter(g2 => g2 !== g).map(g2 => {
            let horizontal = Math.abs(g.x - g2.x);
            for(let col of emptyCols) {
                let lower = Math.min(g.x, g2.x);
                let upper = Math.max(g.x, g2.x);
                if(col > lower && col < upper) {
                    horizontal += expansion - 1;
                }
            }
            let vertical = Math.abs(g.y - g2.y);
            for(let col of emptyRows) {
                let lower = Math.min(g.y, g2.y);
                let upper = Math.max(g.y, g2.y);
                if(col > lower && col < upper) {
                    vertical += expansion - 1;
                }
            }
            return horizontal + vertical;
        });
        let sum = options.reduce((acc, x) => acc+x);
        return sum;
    }).reduce((acc, x) => acc + x);
}
console.log(computeSum(2)/2);
console.log(computeSum(1_000_000)/2);