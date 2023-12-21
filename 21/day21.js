let input = [
    /* Insert AoC day 21 input here */
    "...........",
    ".....###.#.",
    ".###.##..#.",
    "..#.#...#..",
    "....#.#....",
    ".##..S####.",
    ".##..#...#.",
    ".......##..",
    ".##.#.####.",
    ".##..##.##.",
    "...........",
]

// Board
let board = {};
let originalBoard;
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getRawValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] || fallback
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(((x % width) + width) % width, ((y % height) + height) % height)] || fallback
}

// Parse
let startPos = {x: 0, y: 0};

const height = input.length;
const width = input[0].length;
for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
        let c = input[y][x];
        if(c === 'S') {
            startPos.x = x;
            startPos.y = y;
            setValue(board, x, y, '.');
        } else {
            setValue(board, x, y, c);
        }
    }
}

// There will be a lot repetition in the final state
// Besides a fully populated tile, there will be eight distinct types
// These correspond to up, down, left, right and the diagonals
const tilesOfInterest = {};

// Keep track of parallel universes (repetitions of the input grid)
const puTransitionCycles = {};
const puSnapshotCounters = {};
const puSeen = {};

// Utility to ensure a given tally expresses even tiles as they would be
// if the PU is itself on an even coordinate
const swapIfNotEven = (x, tally) => {
    const result = {...tally};
    if(x%2 !== 0) {
        const even = result.even;
        result.even = result.odd;
        result.odd = even;
    }
    return result;
}

// Count the realized even and odd (reachable) spots for a given PU
function tally(puX, puY) {
    const tally = {
        even: 0,
        odd: 0,
    };
    for(let x = puX*width; x < puX*width + width; x++) {
        for(let y = puY*height; y < puY*height + height; y++) {
            if(getValue(originalBoard, x, y, '#') === '#') {
                continue;
            }
            if(getRawValue(board, x, y, null) !== null) {
                const value = getRawValue(board, x, y);
                // Unreachable cells
                if(value === '.') {
                    continue;
                }
                if(value%2 === 0) {
                    tally.even++;
                } else {
                    tally.odd++;
                }
            }
        }
    }
    return tally;
}

// Take snapshot of a given 'direction', this constitutes both a "fresh" and "border" tile
// For example, when taking the snapshot for direction 'right', the tiles may look as follows:
//    -------   -------        -------------   ----------
//   | (0,0) | | (1,0) |  ... | (puX - 1,0) | | (puX, 0) |
//    -------   -------        -------------   ----------
//       ^         ^                 ^              ^
//       \ "full" /               "border"       "fresh"
function makeSnapshot(name) {
    let puX = puTransitionCycles[name].puX;
    let puY = puTransitionCycles[name].puY;
    let puX2 = puX;
    let puY2 = puY;
    // Ugly case to "pull" in the coordinates to capture the "border" tile
    if(name == 'left') {
        puX2++;
    } else if(name == 'right') {
        puX2--;
    } else if(name == 'up') {
        puY2++;
    } else if(name == 'down') {
        puY2--;
    } else if(name == 'up-right') {
        if(Math.abs(puY2) > Math.abs(puX2)) {
            puY2++;
        } else {
            throw "Unexpected";
        }
    } else if(name === "down-left") {
        if(Math.abs(puY2) > Math.abs(puX2)) {
            puY2--;
        } else {
            throw "Unexpected";
        }
    } else if(name === "up-left") {
        if(Math.abs(puY2) > Math.abs(puX2)) {
            puY2++;
        } else {
            throw "Unexpected";
        }
    } else if(name === "down-right") {
        if(Math.abs(puY2) > Math.abs(puX2)) {
            throw "Unexpected";
        } else {
            puX2--;
        }
    }

    tilesOfInterest[name] = {
        fresh: swapIfNotEven(Math.abs(puX) + Math.abs(puY), tally(puX, puY)),
        border: swapIfNotEven(Math.abs(puX2) + Math.abs(puY2), tally(puX2, puY2)),
    }
}

// Simple BFS
const bfs = (initialState, limit) => {
    let queue = [initialState];
    let seenKey = (state) => `${state.x}|${state.y}`
    let i = 0;
    let visited = {};

    while(queue.length) {
        const nextQueue = [];

        // Decrement counters
        for(let puCounter in puSnapshotCounters) {
            puSnapshotCounters[puCounter]--;
            if(puSnapshotCounters[puCounter] === 0) {
                makeSnapshot(puCounter);
            }
        }

        for(let state of queue) {
            const stateKey = seenKey(state);
            if(stateKey in visited) {
                continue;
            }
            visited[stateKey] = true;

            // Check if this PU is new
            const puX = Math.floor(state.x/width);
            const puY = Math.floor(state.y/height);
            const puKey = `${puX}|${puY}`;
            if(!(puKey in puSeen)) {
                // Record cycles of breaching into new PU's
                function recordCycle(name) {
                    if(name in puTransitionCycles) {
                        const cycle = i - puTransitionCycles[name].step;
                        if(cycle !== 0) {
                            if('cycle' in puTransitionCycles[name] && puTransitionCycles[name].cycle !== cycle) {
                                // Cycle found, but the interval isn't consistent yet, store the last inconsistent step
                                puTransitionCycles[name].inconsistent = i;
                            } else if('cycle' in puTransitionCycles[name] && !(name in puSnapshotCounters)) {
                                // Found a cycle, now create a snapshot of the "border" and "fresh" tiles
                                // in this direction. This needs to be done at the right moment, which is
                                // at most (cycle - 1) steps away.
                                const remainingSteps = (limit - (puTransitionCycles[name].inconsistent || puTransitionCycles[name].samples[0])) % cycle;
                                puSnapshotCounters[name] = remainingSteps + 1;
                                puTransitionCycles[name].puX = puX;
                                puTransitionCycles[name].puY = puY;
                            }
                            // Record details
                            puTransitionCycles[name].cycle = cycle;
                            puTransitionCycles[name].samples.push(i);
                        }
                        puTransitionCycles[name].step = i;
                    } else {
                        // First time entering a new PU in this direction.
                        // Since the goal is cycle detection, just record things and continue
                        puTransitionCycles[name] = { step: i, samples: [i], ready: 0 }
                    }
                }

                // Determine in which direction this new PU is found
                if(puX === 0) {
                    if(puY < 0) {
                        recordCycle('up');
                    } else if(puY > 0) {
                        recordCycle('down');
                    }
                } else if(puY == 0) {
                    if(puX < 0) {
                        recordCycle('left');
                    } else if(puX > 0) {
                        recordCycle('right');
                    }
                } else {
                    if(puX < 0) {
                        if(puY < 0) {
                            recordCycle('up-left');
                        } else {
                            recordCycle('down-left');
                        }
                    } else {
                        if(puY < 0) {
                            recordCycle('up-right');
                        } else {
                            recordCycle('down-right');
                        }
                    }
                }
                puSeen[puKey] = true;
            }

            // Record the step at which this state is reached
            setValue(board, state.x, state.y, i);

            // Expand into neighbours
            if(getValue(originalBoard, state.x, state.y - 1, '#') === '.') {
                nextQueue.push({x: state.x, y: state.y - 1, prev: state});
            }
            if(getValue(originalBoard, state.x + 1, state.y, '#') === '.') {
                nextQueue.push({x: state.x + 1, y: state.y, prev: state});
            }
            if(getValue(originalBoard, state.x, state.y + 1, '#') === '.') {
                nextQueue.push({x: state.x, y: state.y + 1, prev: state});
            }
            if(getValue(originalBoard, state.x - 1, state.y, '#') === '.') {
                nextQueue.push({x: state.x - 1, y: state.y, prev: state});
            }
        }
        i++;

        queue = nextQueue;

        if(i === 65) {
            // Part 1
            console.log(Object.values(board).filter(x => x%2 == 0).length);
        }
        // Terminate when all tiles of interest are known (and part 1 is done)
        if(Object.keys(tilesOfInterest).length === 8 && i > 64) {
            break;
        }
    }
}

// Make a copy of the board (before writing to it)
originalBoard = JSON.parse(JSON.stringify(board));

// Part 2
board = JSON.parse(JSON.stringify(originalBoard));
const radius = 26501365;
bfs({...startPos}, radius)

// Returns the number of tiles in a straight direction, this:
//   1. Excludes the center tile
//   2. Includes the "border" tile
//   3. Excludes the "fresh" tile
const countTilesStraight = (name) => {
    const hasInconsistency = !!puTransitionCycles[name].inconsistent;
    if(hasInconsistency) {
        return Math.floor((radius - puTransitionCycles[name].inconsistent) / puTransitionCycles[name].cycle)
            + puTransitionCycles[name].samples.indexOf(puTransitionCycles[name].inconsistent);
    } else {
        return Math.floor((radius - puTransitionCycles[name].samples[0]) / puTransitionCycles[name].cycle);
    }
}
// Returns the number of steps left to reach the final state for a given direction.
// This effectively pretends all full cycles in said direction have taken place, leaving only the final
// steps that would expand into the "fresh" tile (and possibly fill up holes in the "border" tile).
const stepsLeftStraight = (name) => {
    const hasInconsistency = !!puTransitionCycles[name].inconsistent;
    if(hasInconsistency) {
        return (radius - puTransitionCycles[name].inconsistent) % puTransitionCycles[name].cycle;
    } else {
        return (radius - puTransitionCycles[name].samples[0]) % puTransitionCycles[name].cycle;
    }
}
const left = countTilesStraight('left');
const right = countTilesStraight('right');
const up = countTilesStraight('up');
const down = countTilesStraight('down');

// Returns the number of layers in the diagonal directions, this:
//   1. Excludes any of the straight lines or center tile
//   2. Includes the layer with "border" tiles
//   3. Excludes the layer with "fresh" tiles
const countDiagonalLayers = (name) => {
   return Math.floor((radius - puTransitionCycles[name].samples[0]) / puTransitionCycles[name].cycle);
}
// Returns the number of steps left to reach the final state for a given (diagonal) direction.
// This effectively pretends all full cycles in said direction have taken place, leaving only the final
// step that would expand into the layer of "fresh" tiles.
const stepsLeftDiagonal = (name) => {
    return (radius - puTransitionCycles[name].samples[0]) % puTransitionCycles[name].cycle;
}
const upRight = countDiagonalLayers('up-right');
const downLeft = countDiagonalLayers('down-left');
const upLeft = countDiagonalLayers('up-left');
const downRight = countDiagonalLayers('down-right');

// Parts 2
{
    const fullTile = tally(0, 0);
    fullTile.even++; // Starting space

    // Sum up everything
    let totals = {even: 0, odd: 0};
    const sumStraight = (name) => {
        // Iterate over the tiles
        const mostlyFullTiles = countTilesStraight(name);
        for(let x = 1; x <= mostlyFullTiles + 1; x++) {
            // Note: The 'tilesOfInterest' are expressed as if the tile's PU coordinates are even
            //       As a result, if this tile is uneven, the evenness needs to be flipped
            const evenField = (x%2 === 0) ? 'even' : 'odd';
            const oddField = (x%2 === 0) ? 'odd' : 'even';
            if(x === mostlyFullTiles + 1) {
                // Fresh tile (singular)
                totals.even += tilesOfInterest[name].fresh[evenField];
                totals.odd += tilesOfInterest[name].fresh[oddField];
            } else if(x === mostlyFullTiles) {
                // Border tile (singular)
                totals.even += tilesOfInterest[name].border[evenField];
                totals.odd += tilesOfInterest[name].border[oddField];
            } else {
                // Full tiles (multiple)
                totals.even += fullTile[evenField];
                totals.odd += fullTile[oddField];
            }
        }
    }

    const sumTriangle = (name) => {
        // Iterate over the layers of the triangle (from center outwards)
        const mostlyFullLayers = countDiagonalLayers(name);
        for(let layer = 0; layer < mostlyFullLayers+1; layer++) {
            // 1st layer = |Lx|+|Ly| === 2
            // 2nd layer = |Lx|+|Ly| === 3
            // etc...
            // Determine evenness of entire layer
            const evenLayer = (layer+2)%2 === 0;
            // Length of the layer is (layer + 1)
            const length = layer + 1;

            // Note:  The 'tilesOfInterest' are expressed as if the tile's PU coordinates are even
            //        As a result, if the tiles of this layer are uneven, the evenness needs to be flipped
            // Note2: All tiles for a given layer share the same evenness
            const evenOrOdd = evenLayer ? 'even' : 'odd';
            const oddOrEven = evenLayer ? 'odd' : 'even';
            if(layer === mostlyFullLayers) {
                // Fresh tiles
                totals.even += tilesOfInterest[name].fresh[evenOrOdd]*length;
                totals.odd += tilesOfInterest[name].fresh[oddOrEven]*length;
            } else if(layer === mostlyFullLayers - 1) {
                // Border tiles
                totals.even += tilesOfInterest[name].border[evenOrOdd]*length;
                totals.odd += tilesOfInterest[name].border[oddOrEven]*length;
            } else {
                // Full tiles
                totals.even += fullTile[evenOrOdd]*length;
                totals.odd += fullTile[oddOrEven]*length;
            }
        }
    }

    // Straight lines
    sumStraight('left');
    sumStraight('right');
    sumStraight('up');
    sumStraight('down');

    // Center tile
    totals.even += fullTile.even;
    totals.odd += fullTile.odd;
    totals.tiles++;
    totals.fullTiles++;

    // Triangles
    sumTriangle('up-right');
    sumTriangle('down-right');
    sumTriangle('down-left');
    sumTriangle('up-left');

    if(radius%2 === 0) {
        console.log(totals.even);
    } else {
        console.log(totals.odd);
    }
}

