let input = [
    /* Insert AoC day 17 input here */
    "2413432311323",
    "3215453535623",
    "3255245654254",
    "3446585845452",
    "4546657867536",
    "1438598798454",
    "4457876987766",
    "3637877979653",
    "4654967986887",
    "4564679986453",
    "1224686865563",
    "2546548887735",
    "4322674655533",
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
        setValue(board, x, y, +input[y][x]);
    }
}

function astar(minStraight, maxStraight) {
    let targetX = width - 1;
    let targetY = height - 1;
    let open = [{x: 0, y: 0, loss: 0, f: targetX + targetY, lastDir: -1, ldc: 0}];
    let closed = {};
    while(open.length) {
        let curr = open.reduce((a,b) => a.f < b.f ? a : b);
        let curr_index = open.indexOf(curr);
        open.splice(curr_index, 1);
    
        let key = `${curr.x}|${curr.y}|${curr.dir}`;
        closed[key] = true;
        if(curr.x == targetX && curr.y == targetY) {
            return curr.loss;
        }

        let children = [];
        for(let dir = 0; dir < 4; dir++) {
            const child = {x: curr.x, y: curr.y, loss: curr.loss, f: 0, dir: dir};
            for(let i = 0; i < maxStraight; i++) {
                if(child.dir == 0) {
                    child.y--;
                    child.loss += getValue(board, child.x, child.y);
                } else if(child.dir == 1) {
                    child.x++;
                    child.loss += getValue(board, child.x, child.y);
                } else if(child.dir == 2) {
                    child.y++;
                    child.loss += getValue(board, child.x, child.y);
                } else if(child.dir == 3) {
                    child.x--;
                    child.loss += getValue(board, child.x, child.y);
                }
                if(i >= minStraight - 1) {
                    children.push({...child});
                }
            }
        }
    
        for(let child of children) {
            // Bounds
            if(child.x < 0 || child.x >= width || child.y < 0 || child.y >= height) {
                continue;
            }
            // Must turn
            if((curr.dir + 2) % 4 === child.dir || curr.dir === child.dir) {
                continue;
            }
    
            let childKey = `${child.x}|${child.y}|${child.dir}`;
            if(closed[childKey]) {
                continue;
            }

            child.f = child.loss + (targetX - child.x) + (targetY - child.y);
            let matching_index = open.findIndex(node => node.x == child.x && node.y == child.y && node.dir == child.dir);
            if(matching_index >= 0) {
                let matching = open[matching_index];
                if(matching.loss < child.loss) {
                    continue;
                }
                open.splice(matching_index, 1)
            }
            open.push(child);
        }
    }

}

// Part 1
console.log(astar(1, 3));
// Part 2
console.log(astar(4, 10));