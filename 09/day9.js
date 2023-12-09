let input = [
    /* Insert AoC day 9 input here */
    "0 3 6 9 12 15",
    "1 3 6 10 15 21",
    "10 13 16 21 30 45",
]

// Part 1
function predict(sequence) {
    let layers = [ sequence ];
    let nextLayer = [];
    do {
        nextLayer = []
        const lastLayer = layers[layers.length - 1];
        for(let i = 0; i < lastLayer.length - 1; i++) {
            nextLayer.push(lastLayer[i + 1] - lastLayer[i]);
        }
        layers.push(nextLayer);
    } while(nextLayer.some(x => x != 0))

    // Reverse
    let inserted = 0;
    for(let l = layers.length - 2; l >= 0; l--) {
        inserted = layers[l][layers[l].length - 1] + inserted;
    }

    return inserted;
}

let sequences = input.map(l => l.split(" ").map(x => +x));

let sum = 0;
for(let i = 0; i < sequences.length; i++) {
    sum += predict(sequences[i])
}
console.log(sum)

// Part 2
function prepredict(sequence) {
    let layers = [ sequence ];
    let nextLayer = [];
    do {
        nextLayer = []
        const lastLayer = layers[layers.length - 1];
        for(let i = 0; i < lastLayer.length - 1; i++) {
            nextLayer.push(lastLayer[i + 1] - lastLayer[i]);
        }
        layers.push(nextLayer);
    } while(nextLayer.some(x => x != 0))

    // Reverse
    let inserted = 0;
    for(let l = layers.length - 2; l >= 0; l--) {
        inserted = layers[l][0] - inserted;
    }

    return inserted;
}

sum = 0;
for(let i = 0; i < sequences.length; i++) {
    sum += prepredict(sequences[i])
}
console.log(sum)