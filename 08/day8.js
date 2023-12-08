let input = [
    /* Insert AoC day 8 input here */
    "RL",
    "",
    "AAA = (BBB, CCC)",
    "BBB = (DDD, EEE)",
    "CCC = (ZZZ, GGG)",
    "DDD = (DDD, DDD)",
    "EEE = (EEE, EEE)",
    "GGG = (GGG, GGG)",
    "ZZZ = (ZZZ, ZZZ)",
]

// Part 1
let instructions = input[0];
let graph = {};
for(let i = 2; i < input.length; i++) {
    let parts = input[i].split(" = ");
    let from = parts[0];
    let left = parts[1].substring(1, 4);
    let right = parts[1].substring(6, 9);
    graph[from] = [left, right];
}

function cycleLength(start) {
    let currNode = start;
    let steps = 0;
    while(currNode[2] !== 'Z') {
        let goLeft = instructions[steps % instructions.length] === 'L';
        currNode = graph[currNode][goLeft ? 0 : 1]
        steps++;
    }
    return steps;
}
console.log(cycleLength('AAA'));

const gcd = (a, b) => !b ? a :gcd(b, a % b)

// Part 2
const startNodes = Object.keys(graph).filter(x => x[2] === 'A')
const cycles = startNodes.map(n => [n, cycleLength(n)]);
console.log(cycles)

let cycle = cycles[0][1];
for(let i = 1; i < cycles.length; i++) {
    cycle = cycle * cycles[i][1] / gcd(cycle, cycles[i][1])
}
console.log(cycle);
