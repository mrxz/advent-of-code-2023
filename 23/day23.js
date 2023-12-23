let input = [
    /* Insert AoC day 23 input here */
    "#.#####################",
    "#.......#########...###",
    "#######.#########.#.###",
    "###.....#.>.>.###.#.###",
    "###v#####.#v#.###.#.###",
    "###.>...#.#.#.....#...#",
    "###v###.#.#.#########.#",
    "###...#.#.#.......#...#",
    "#####.#.#.#######.#.###",
    "#.....#.#.#.......#...#",
    "#.#####.#.#.#########v#",
    "#.#...#...#...###...>.#",
    "#.#.#v#######v###.###v#",
    "#...#.>.#...>.>.#.###.#",
    "#####v#.#.###v#.#.###.#",
    "#.....#...#...#.#.#...#",
    "#.#########.###.#.#.###",
    "#...###...#...#...#.###",
    "###.###.#.###v#####v###",
    "#...#...#.#.>.>.#.>.###",
    "#.###.###.#.###.#.#v###",
    "#.....###...###...#...#",
    "#####################.#",
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

// Parse
const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        setValue(board, x, y, input[y][x]);
    }
}

// Find intersections
const intersections = {};
for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        if(getValue(board, x, y, '#') === '#') {
            continue;
        }

        let neighbours =
            ("><^v".indexOf(getValue(board, x - 1, y, '#')) !== -1 ? 1 : 0) +
            ("><^v".indexOf(getValue(board, x + 1, y, '#')) !== -1 ? 1 : 0) +
            ("><^v".indexOf(getValue(board, x, y - 1, '#')) !== -1 ? 1 : 0) +
            ("><^v".indexOf(getValue(board, x, y + 1, '#')) !== -1 ? 1 : 0);
        if(neighbours > 2) {
            intersections[`${x}|${y}`] = {x, y, neighbours: []};
        }
    }
}
// Start and end nodes
intersections[`1|0`] = {x: 1, y: 0, neighbours: []};
intersections[`${width - 2}|${height - 1}`] = {x: width - 2, y: height - 1, neighbours: []};

// Function for measuring the distance from a given intersection to its neighbours
const measureNeighbours = (intersection) => {
    let seenKey = (state) => `${state.x}|${state.y}`
    const walk = (pos, origin) => {
        let length = 1;
        let lastPos = {x: origin.x, y: origin.y};
        let slopeAllowed = true;
        while(!(seenKey(pos) in intersections)) {
            const nextPos = {...pos};
            // Find direction to walk in (always one)
            let slope;
            if((lastPos.x !== pos.x + 1) && (slope = getValue(board, pos.x + 1, pos.y, '#')) !== '#') {
                if(slope !== '.' && slope !== '>') slopeAllowed = false;
                nextPos.x++
            } else if((lastPos.y !== pos.y + 1) && (slope = getValue(board, pos.x, pos.y + 1, '#')) !== '#') {
                if(slope !== '.' && slope !== 'v') slopeAllowed = false;
                nextPos.y++;
            } else if((lastPos.x !== pos.x - 1) && (slope = getValue(board, pos.x - 1, pos.y, '#')) !== '#') {
                if(slope !== '.' && slope !== '<') slopeAllowed = false;
                nextPos.x--;
            } else if((lastPos.y !== pos.y - 1) && (slope = getValue(board, pos.x, pos.y - 1, '#')) !== '#') {
                if(slope !== '.' && slope !== '^') slopeAllowed = false;
                nextPos.y--;
            }

            lastPos = pos;
            pos = nextPos;
            length++;
        }

        return {length, next: intersections[seenKey(pos)], slopeAllowed};
    }

    // Check four possible starting directions to walk in
    let slope;
    if((slope = getValue(board, intersection.x + 1, intersection.y, '#')) !== '#') {
        const result = walk({x: intersection.x + 1, y: intersection.y}, intersection);
        intersection.neighbours.push(result);
    }
    if((slope = getValue(board, intersection.x, intersection.y + 1, '#')) !== '#') {
        const result = walk({x: intersection.x, y: intersection.y + 1}, intersection);
        intersection.neighbours.push(result);
    }
    if((slope = getValue(board, intersection.x - 1, intersection.y, '#')) !== '#') {
        const result = walk({x: intersection.x - 1, y: intersection.y}, intersection);
        intersection.neighbours.push(result);
    }
    if((slope = getValue(board, intersection.x, intersection.y - 1, '#')) !== '#') {
        const result = walk({x: intersection.x, y: intersection.y - 1}, intersection);
        intersection.neighbours.push(result);
    }
}
for(let intersection of Object.values(intersections)) {
    measureNeighbours(intersection);
}

const dfs = (state, respectSlopes) => {
    if(state.x === width - 2 && state.y === height - 1) {
        return state.length;
    }

    let seenKey = (state) => `${state.x}|${state.y}`
    const intersection = intersections[seenKey(state)];
    let maxLength = -1;
    for(let neighbour of intersection.neighbours) {
        if(respectSlopes && !neighbour.slopeAllowed) {
            continue;
        }
        if(seenKey(neighbour.next) in state.visited) {
            continue;
        }
        const length = dfs({
            x: neighbour.next.x,
            y: neighbour.next.y,
            length: state.length + neighbour.length,
            visited: {...state.visited, [seenKey(state)]: true}
        }, respectSlopes);
        if(length > maxLength) {
            maxLength = length;
        }
    }

    return maxLength;
}

console.log(dfs({x: 1, y: 0, length: 0, visited: {}}, true))
console.log(dfs({x: 1, y: 0, length: 0, visited: {}}, false))
