let input = [
    /* Insert AoC day 4 input here */
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
    "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
]

// Part 1
let sum = 0;
let lookup = []

let cards = input.map(line => {
    const numbersStr = line.split(":")[1];
    const [winning, numbers] = numbersStr.split("|").map(l => l.trim().split(/\s+/).map(x => +(x.trim())));

    let score = 0;
    let scorePower = 0;
    for(let wn of winning) {
        if(numbers.indexOf(wn) !== -1) {
            score++;
            scorePower = scorePower === 0 ? 1 : (scorePower * 2);
        }
    }
    sum += scorePower;

    lookup.push(score);
})

console.log(sum)

// Part 2;
const cache = {};
function howMany(c) {
    if(`${c}` in cache) {
        return cache[`${c}`];
    }

    let result = 1;
    for(let c2 = c+1; c2 < c+1+lookup[c]; c2++) {
        result += howMany(c2);
    }

    cache[`${c}`] = result;
    return result;
}

sum = 0;
for(let i = 0; i < input.length; i++) {
    sum += howMany(i);
}
console.log(sum);