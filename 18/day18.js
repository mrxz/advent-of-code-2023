let input = [
    /* Insert AoC day 18 input here */
    "R 6 (#70c710)",
    "D 5 (#0dc571)",
    "L 2 (#5713f0)",
    "D 2 (#d2c081)",
    "R 2 (#59c680)",
    "D 2 (#411b91)",
    "L 5 (#8ceee2)",
    "U 2 (#caa173)",
    "L 1 (#1b58a2)",
    "U 2 (#caa171)",
    "R 2 (#7807d2)",
    "U 3 (#a77fa3)",
    "L 2 (#015232)",
    "U 2 (#7a21e3)",
]

// Part 1
let instructions = input.map(line => line.split(" ")).map(parts => ({ dir: parts[0], steps: +parts[1] }))

// Part 2
let hexInstructions = input.map(line => line.split(" ")).map(parts => {
    let hexInstruction = parts[2].substring(2, parts[2].length - 1);
    let steps = Number.parseInt(hexInstruction.substring(0, hexInstruction.length - 1), 16);
    let dir = "RDLU"[+hexInstruction[hexInstruction.length - 1]]

    return { dir, steps }
});

function computeArea(instructions) {
    let xs = [0];
    let ys = [0];
    let pos = {x: 0, y: 0};
    let length = 0;
    for(let i = 0; i < instructions.length; i++) {
        let ins = instructions[i];
        if(ins.dir === 'U') {
            pos.y -= ins.steps;
        } else if(ins.dir === 'R') {
            pos.x += ins.steps;
        } else if(ins.dir === 'D') {
            pos.y += ins.steps;
        } else if(ins.dir === 'L') {
            pos.x -= ins.steps;
        }
        xs.push(pos.x);
        ys.push(pos.y);
        length += ins.steps;
    }

    // "close" polygon
    const N = xs.length;
    xs[N] = xs[0];
    xs[N+1] = xs[1];
    ys[N] = ys[0];
    ys[N+1] = ys[1];

    // compute area
    let area = 0;
    for(let i = 1; i <= N; i++) {
        area += xs[i]*(ys[i+1] - ys[i-1]);
    }
    return (area + length) / 2 + 1;
}

console.log(computeArea(instructions));
console.log(computeArea(hexInstructions));
