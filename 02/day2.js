let input = [
    /* Insert AoC day 2 input here */
    "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
    "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
]

// Part 1
let sum = 0;
const max = {
    red: 12,
    green: 13,
    blue: 14
}
for(let game of input) {

    const [id, setsRaw] = game.split(': ', 2);
    const sets = setsRaw.split('; ').map(x => x.split(', ').map(y => [+y.split(' ')[0], y.split(' ')[1]]));

    let possible = true;
    outer:
    for(let set of sets) {
        for(let pair of set) {
            if(pair[0] > max[pair[1]]) {
                possible = false;
                break outer;
            }
        }
    }

    if(possible) {
        sum += +id.split(' ')[1];
    }
    //console.log(id, sets, possible);
}

console.log(sum)

// Part 2
sum = 0;
for(let game of input) {

    const [id, setsRaw] = game.split(': ', 2);
    const sets = setsRaw.split('; ').map(x => x.split(', ').map(y => [+y.split(' ')[0], y.split(' ')[1]]));

    let minimal = { red: 0, green: 0, blue: 0 };
    for(let set of sets) {
        for(let pair of set) {
            minimal[pair[1]] = Math.max(minimal[pair[1]], pair[0]);
        }
    }

    sum += Object.values(minimal).reduce((prod, x) => prod*x, 1);
}

console.log(sum)