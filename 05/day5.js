let input = [
    /* Insert AoC day 5 input here */
    "seeds: 79 14 55 13",
    "",
    "seed-to-soil map:",
    "50 98 2",
    "52 50 48",
    "",
    "soil-to-fertilizer map:",
    "0 15 37",
    "37 52 2",
    "39 0 15",
    "",
    "fertilizer-to-water map:",
    "49 53 8",
    "0 11 42",
    "42 0 7",
    "57 7 4",
    "",
    "water-to-light map:",
    "88 18 7",
    "18 25 70",
    "",
    "light-to-temperature map:",
    "45 77 23",
    "81 45 19",
    "68 64 13",
    "",
    "temperature-to-humidity map:",
    "0 69 1",
    "1 0 69",
    "",
    "humidity-to-location map:",
    "60 56 37",
    "56 93 4",
]

const seeds = input[0].split(": ")[1].split(" ");

let maps = {};
let currentMap = null;
for(let i = 2; i < input.length; i++) {
    if(!currentMap) {
        if(input[i].length == 0) {
            continue;
        }

        let line = input[i].split(" ")[0].split('-');
        let from = line[0];
        let to = line[2];
        currentMap = [];
        maps[from] = (maps[from] || {});
        maps[from][to] = currentMap;
    } else {
        if(input[i].length == 0) {
            currentMap = null;
            continue;
        }

        let parts = input[i].split(' ').map(x => +x);
        currentMap.push({ srcStart: parts[1], srcEnd: parts[1] + parts[2], dstStart: parts[0], dstEnd: parts[0] + parts[2] })
    }
}

// Part 1
let min = Number.MAX_SAFE_INTEGER;

for(let seed of seeds) {
    console.log()
    let state = 'seed';
    let number = seed;

    while(state !== 'location') {
        // Find relevant range
        const nextState = Object.keys(maps[state])[0];
        const mapping = maps[state][nextState];
        const range = mapping.find(r => number >= r.srcStart && number <= r.srcEnd);
        if(range) {
            const offset = number - range.srcStart;
            number = range.dstStart + offset;
        } else {
            // Number= number
        }

        console.log(`${seed}: ${state} -> ${nextState} (${number})`);
        state = nextState;
    }
    min = Math.min(number, min);
}
console.log(min)
console.log();
console.log();

// Part 2
const seedRanges = [];
for(let i = 0; i < seeds.length; i += 2) {
    seedRanges.push({
        srcStart: +seeds[i], srcEnd: +seeds[i] + +seeds[i + 1],
    });
}
//console.log(seedRanges);

let ranges = [...seedRanges].sort((a,b) => a.srcStart - b.srcStart);
let state = 'seed'
while(state !== 'location') {
    const nextState = Object.keys(maps[state])[0];
    const mapping = [...maps[state][nextState]].sort((a,b) => a.srcStart - b.srcStart);
    const nextRanges = [];

    let mi = 0;
    let i = 0;
    while(i < ranges.length) {
        console.log(ranges[i]);
        // Find first mapping
        while(mi < mapping.length && mapping[mi].srcEnd < ranges[i].srcStart) {
            mi++;
        }

        if(!mapping[mi]) {
            console.log(i, 'FULL RANGE OUTSIDE OF MAPPING');
            nextRanges.push({
                srcStart: ranges[i].srcStart,
                srcEnd: ranges[i].srcEnd
            })
        } else if(ranges[i].srcStart <= mapping[mi].srcStart) {
            if(ranges[i].srcStart !== mapping[mi].srcStart) {
                console.log(i, 'RANGE START', ranges[i].srcStart);
                nextRanges.push({
                    srcStart: ranges[i].srcStart,
                    srcEnd: mapping[mi].srcStart
                })
            }
            console.log(i, 'MAPPING START', mapping[mi].srcStart);
        } else {
            console.log(i, 'RANGE START (IN MAPPING)', ranges[i].srcStart);
            var hasMapping = !!mapping[mi];
            var lastBound = ranges[i].srcStart;
            while(mapping[mi]) {
                if(mapping[mi].srcEnd > ranges[i].srcEnd) {
                    if(mapping[mi].srcStart >= ranges[i].srcEnd) {
                        hasMapping = false;
                    }
                    break;
                }
                const contained = mapping[mi].srcStart >= ranges[i].srcStart;
                if(contained) {
                    console.log(i, 'MAPPING END (CONTAINED)', mapping[mi].srcEnd);
                    nextRanges.push({
                        srcStart: lastBound,
                        srcEnd: mapping[mi].srcStart
                    })
                    nextRanges.push({
                        srcStart: mapping[mi].dstStart,
                        srcEnd: mapping[mi].dstEnd
                    })
                } else {
                    if(lastBound >= mapping[mi].srcStart) {
                        const offset = lastBound - mapping[mi].srcStart;
                        console.log(i, 'MAPPING END (offset path)', mapping[mi].srcEnd, offset);
                        if(offset < 0) { throw Error("Invalid offset: " + offset) }
                        nextRanges.push({
                            srcStart: mapping[mi].dstStart + offset,
                            srcEnd: mapping[mi].dstEnd
                        })
                    } else {
                        console.log(i, 'MAPPING END (non offset path)', mapping[mi].srcEnd);
                        nextRanges.push({
                            srcStart: lastBound,
                            srcEnd: mapping[mi].srcStart
                        })
                        nextRanges.push({
                            srcStart: mapping[mi].dstStart,
                            srcEnd: mapping[mi].dstEnd
                        })
                    }
                }
                lastBound = mapping[mi].srcEnd;
                mi++;
                hasMapping = !!mapping[mi]
            }

            console.log(i, 'RANGE END', hasMapping, ranges[i].srcEnd);
            const length = ranges[i].srcEnd - lastBound;
            if(hasMapping) {
                //
                const offset = lastBound - mapping[mi].srcStart;
                if(offset < 0) { throw Error("Invalid offset: " + offset) }
                if(length > 0) {
                    console.log('\t', offset, i);
                    nextRanges.push({
                        srcStart: mapping[mi].dstStart + offset,
                        srcEnd: mapping[mi].dstStart + offset + length
                    })
                }
            } else {
                if(length > 0) {
                    nextRanges.push({
                        srcStart: lastBound,
                        srcEnd: ranges[i].srcEnd
                    })
                }
            }
        }

        i++;
    }

    state = nextState;
    ranges = nextRanges;
    ranges.sort((a,b) => a.srcStart - b.srcStart);
    console.log('----------------', nextState)
}

console.log(ranges[0].srcStart);