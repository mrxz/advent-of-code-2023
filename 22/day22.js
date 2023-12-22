let input = [
    /* Insert AoC day 22 input here */
    "1,0,1~1,2,1",
    "0,0,2~2,0,2",
    "0,2,3~2,2,3",
    "0,0,4~0,2,4",
    "2,0,5~2,2,5",
    "0,1,6~2,1,6",
    "1,1,8~1,1,9",
]

let board = {};
const getKey = (x,y) => `${x}x${y}`;
const setValue = (board, x, y, value) => {
    board[getKey(x, y)] = value;
}
const getValue = (board, x, y, fallback = null) => {
    return board[getKey(x, y)] || fallback
}

// Part 1
const bricks = input.map(line => {
    const parts = line.split("~").map(p => p.split(",").map(x => +x));

    const boundingBox = {
        minX: Math.min(parts[0][0], parts[1][0]),
        maxX: Math.max(parts[0][0], parts[1][0]),
        minY: Math.min(parts[0][1], parts[1][1]),
        maxY: Math.max(parts[0][1], parts[1][1]),
        minZ: Math.min(parts[0][2], parts[1][2]),
        maxZ: Math.max(parts[0][2], parts[1][2]),
    }
    return boundingBox;
})

function recordBrick(board, brick) {
    for(let x = brick.minX; x <= brick.maxX; x++) {
        for(let y = brick.minY; y <= brick.maxY; y++) {
            setValue(board, x, y, brick.maxZ);
        }
    }
}

function getLowest(board, brick) {
    let lowest = 0;
    for(let x = brick.minX; x <= brick.maxX; x++) {
        for(let y = brick.minY; y <= brick.maxY; y++) {
            const gl = getValue(board, x, y, 0);
            lowest = Math.max(lowest, gl);
        }
    }
    return lowest;
}

// Simulate them falling down
function applyGravity(bricks, excludeBrick = -1) {
    const groundLevel = {};
    bricks.sort((a,b) => a.minZ - b.minZ);

    let impacted = 0;
    for(let i = 0; i < bricks.length; i++) {
        if(i === excludeBrick) continue;

        const brick = bricks[i];
        const lowest = getLowest(groundLevel, brick);
        if(lowest !== brick.minZ - 1) {
            // Move brick down
            impacted++;
            const delta = (brick.minZ - lowest - 1);
            brick.minZ -= delta;
            brick.maxZ -= delta;
        }
        recordBrick(groundLevel, bricks[i]);
    }

    return impacted;
}

// Initial gravity
applyGravity(bricks);

// Check what happens when each brick is removed
{
    let sum = 0;
    let fallSum = 0;
    for(let i = 0; i < bricks.length; i++) {
        const impacted = applyGravity(JSON.parse(JSON.stringify(bricks)), i);
        if(impacted === 0) {
            sum++; // Part 1
        } else {
            fallSum += impacted; // Part 2
        }
    }
    console.log(sum);
    console.log(fallSum);
}
